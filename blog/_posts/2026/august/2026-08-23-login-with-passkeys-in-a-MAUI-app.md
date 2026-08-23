---
title: Login with Passkeys in a .NET MAUI 3App
tag:
    - dotnet maui
    - programming
omit: true
---

I’ve been digging through the .NET MAUI Preview 7 changes, and there’s one addition that deserves a bit more attention than a bullet point in some release notes.

**.NET MAUI now has a cross-platform Passkeys API.**

Not a wrapper around a web page. Not "open the browser, authenticate and come back". It actually talks to the native passkey APIs on iOS, Android and Windows. Pleasingly, the API itself is tiny.

```csharp
Passkeys.IsSupported
Passkeys.CreateAsync(...)
Passkeys.AssertAsync(...)
```

That's pretty much the MAUI side of it.

Of course, anyone who's implemented authentication before will immediately recognise the trap hiding in that sentence.

The client API might be tiny. Passkeys themselves are not.

So I went through the new MAUI sample and the accompanying ASP.NET Core server plus the API design to see what a real implementation actually looks like.

The good news is that the split is sensible. MAUI handles the awkward platform-specific bit. Your server handles the security-sensitive WebAuthn bit. That gives us something we can actually build with.

## What MAUI is doing

The new API lives in:

```csharp
using Microsoft.Maui.Authentication;
```

and is essentially a bridge between your server and the platform authenticator.

The overall registration flow looks like this:

```text
MAUI app
   |
   | Ask server to begin registration
   v
Server
   |
   | WebAuthn creation options JSON
   v
MAUI Passkeys.CreateAsync()
   |
   | Native Face ID / fingerprint / PIN / Windows Hello UI
   v
Platform authenticator
   |
   | WebAuthn credential response
   v
MAUI app
   |
   | Send response to server
   v
Server verifies it and stores the passkey
```

Authentication is basically the same thing in reverse:

```text
MAUI app
   |
   | Ask server to begin authentication
   v
Server
   |
   | WebAuthn request options JSON
   v
MAUI Passkeys.AssertAsync()
   |
   | Native authentication UI
   v
Platform authenticator
   |
   | Signed assertion
   v
MAUI app
   |
   | Send assertion to server
   v
Server verifies it and signs the user in
```

That JSON-in, JSON-out design is deliberate. MAUI doesn't generate challenges, verify signatures or decide whether somebody should be allowed into your application. Nor should it.

The private key also stays with the platform authenticator. Your app is shuffling WebAuthn messages around, rather than becoming responsible for storing some exciting new authentication secret that we'll all regret in six months.

## Platform support

In Preview 7, the built-in implementation covers:

- **Android 14 / API 34+**
- **iOS and iPadOS 16+**
- **Mac Catalyst 16+**
- **Windows 10 version 1903+**

You can check that at runtime:

```csharp
if (!Passkeys.IsSupported)
{
    // Show your normal login flow.
    return;
}
```

One important detail: `IsSupported` tells you that the OS has the necessary passkey support. It doesn't tell you that you've configured everything correctly, as with other IsSupported properties.

Your app and your authentication domain still have to trust each other, which we'll get to shortly.

## Let's actually implement it

I'm going to assume we already have:

- a .NET MAUI application;
- an HTTPS API, perhaps at `https://auth.example.com`;
- users who can already authenticate;
- some mechanism for issuing access/refresh tokens or sessions.

We're adding passkeys to that rather than designing authentication from scratch. The MAUI sample uses ASP.NET Core Identity on its backend, so I'll do the same here.

### Step 1: configure the relying party on the server

The first thing your server needs to know is its relying-party ID.

If our authentication server is:

```text
https://auth.example.com
```

then the RP ID would normally be:

```text
auth.example.com
```

With ASP.NET Core Identity:

```csharp
builder.Services.Configure<IdentityPasskeyOptions>(options =>
{
    options.ServerDomain = "auth.example.com";

    options.ValidateOrigin = context =>
    {
        var allowedOrigins = new[]
        {
            "https://auth.example.com",

            // Android's origin will also go here.
            "android:apk-key-hash:YOUR_APP_SIGNING_HASH"
        };

        return ValueTask.FromResult(
            allowedOrigins.Contains(context.Origin));
    };
});
```

That `ValidateOrigin` is worth noticing. A native application doesn't have a browser page URL from which WebAuthn can derive its origin.

Apple effectively uses your associated HTTPS domain. Windows uses the RP HTTPS origin. Android identifies the application using an origin based on the hash of its signing certificate:

```text
android:apk-key-hash:<base64url-sha256-signing-certificate>
```

The server therefore needs to accept the appropriate origin for each native application allowed to authenticate against it. You'll also need the Identity schema capable of storing passkeys. The MAUI sample enables Identity schema version 3:

```csharp
builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    options.Stores.SchemaVersion = IdentitySchemaVersions.Version3;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddSignInManager();
```

Unlike the MAUI sample, your production database obviously shouldn't be an in-memory SQLite database that disappears whenever somebody looks at the server funny. Use your normal persistent Identity store and migrations. Security practices are just as important with passkeys as they are with passwords.

## Step 2: create the registration begin endpoint

A passkey normally gets added to an account that we already trust. So imagine somebody has logged into the app normally and tapped:

**Add a passkey**

The MAUI app first asks the server to start a registration ceremony.

```csharp
app.MapPost("/passkeys/register/begin", async (
    HttpContext context,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager) =>
{
    var user = await userManager.GetUserAsync(context.User);

    if (user is null)
        return Results.Unauthorized();

    var userId = await userManager.GetUserIdAsync(user);
    var userName =
        await userManager.GetUserNameAsync(user)
        ?? throw new InvalidOperationException("User has no username.");

    var optionsJson =
        await signInManager.MakePasskeyCreationOptionsAsync(
            new PasskeyUserEntity
            {
                Id = userId,
                Name = userName,
                DisplayName = userName
            });

    return Results.Content(
        optionsJson,
        "application/json");
})
.RequireAuthorization();
```

`MakePasskeyCreationOptionsAsync()` creates the standard WebAuthn `PublicKeyCredentialCreationOptions` that the authenticator needs. This contains things such as the challenge and relying-party details. 

The important bit is that **the server creates them**. Don't generate a challenge in your MAUI application and don't try to manufacture this JSON yourself.

## Step 3: ask MAUI to create the passkey

Back in the app:

```csharp
using Microsoft.Maui.Authentication;
using System.Text;

public async Task CreatePasskeyAsync(
    CancellationToken cancellationToken = default)
{
    if (!Passkeys.IsSupported)
        throw new FeatureNotSupportedException(
            "Passkeys aren't supported on this device.");

    using var beginResponse =
        await httpClient.PostAsync(
            "/passkeys/register/begin",
            content: null,
            cancellationToken);

    beginResponse.EnsureSuccessStatusCode();

    var creationOptionsJson =
        await beginResponse.Content.ReadAsStringAsync(
            cancellationToken);

    var passkeyResponse =
        await Passkeys.CreateAsync(
            creationOptionsJson,
            cancellationToken);

    using var content = new StringContent(
        passkeyResponse.ToString(),
        Encoding.UTF8,
        "application/json");

    using var finishResponse =
        await httpClient.PostAsync(
            "/passkeys/register/finish",
            content,
            cancellationToken);

    finishResponse.EnsureSuccessStatusCode();
}
```

There's one slightly subtle thing in there.

This:

```csharp
passkeyResponse.ToString()
```

isn't just a nice debugging representation of the response. It is the actual WebAuthn JSON that needs to go back to your server.

So don't do this:

```csharp
await httpClient.PostAsJsonAsync(
    "/passkeys/register/finish",
    passkeyResponse.ToString());
```

That would serialise your JSON _string_ and leave your server with one big escaped JSON value. Send it as raw `application/json`. The MAUI API was deliberately designed so the result of `CreateAsync()` can effectively be passed straight back to the relying party.

At this point MAUI will invoke the platform UI.

Depending on the device, that'll mean Face ID, Touch ID, fingerprint, PIN, Windows Hello or whatever authenticator the platform has available. There is no platform-specific code in our ViewModel, which is the point.

## Step 4: verify and store the new passkey

Now we need `/passkeys/register/finish`.

The MAUI sample uses `PerformPasskeyAttestationAsync()` to validate the result:

```csharp
app.MapPost("/passkeys/register/finish", async (
    HttpContext context,
    JsonElement credential,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager) =>
{
    var user = await userManager.GetUserAsync(context.User);

    if (user is null)
        return Results.Unauthorized();

    var attestation =
        await signInManager.PerformPasskeyAttestationAsync(
            credential.GetRawText());

    if (!attestation.Succeeded)
    {
        return Results.BadRequest(new
        {
            error = attestation.Failure?.Message
        });
    }

    var userId = await userManager.GetUserIdAsync(user);

    if (!string.Equals(
        userId,
        attestation.UserEntity.Id,
        StringComparison.Ordinal))
    {
        return Results.BadRequest(
            "The passkey doesn't belong to the authenticated user.");
    }

    var result =
        await userManager.AddOrUpdatePasskeyAsync(
            user,
            attestation.Passkey);

    if (!result.Succeeded)
        return Results.BadRequest();

    return Results.Ok();
})
.RequireAuthorization();
```

There are two separate security checks happening here. First, Identity verifies the WebAuthn attestation. Then we're making sure the identity represented by that ceremony matches the user who is currently authenticated.

Only after both of those things have happened do we store the credential. The stored record contains the public-key information needed to verify future assertions. The private key remains with the user's authenticator.

## Step 5: start a passkey login

Now we can get rid of the password. Or at least stop asking for it every five minutes.

Our login begin endpoint doesn't even need a username:

```csharp
app.MapPost("/passkeys/login/begin", async (
    SignInManager<ApplicationUser> signInManager) =>
{
    var optionsJson =
        await signInManager.MakePasskeyRequestOptionsAsync(
            user: null);

    return Results.Content(
        optionsJson,
        "application/json");
});
```

Passing `null` means we're asking for a discoverable, username-less authentication.

The OS can show the user the passkeys available for this relying party and the credential itself gives the server enough information to work out which user is authenticating.

Your login screen can effectively become:

```text
Sign in with a passkey

or

Sign in another way
```

rather than asking for an email address before we even know whether we need it.

## Step 6: authenticate with the passkey in MAUI

The client side looks remarkably similar to registration.

```csharp
public async Task<AuthTokens> SignInWithPasskeyAsync(
    CancellationToken cancellationToken = default)
{
    if (!Passkeys.IsSupported)
        throw new FeatureNotSupportedException(
            "Passkeys aren't supported on this device.");

    using var beginResponse =
        await httpClient.PostAsync(
            "/passkeys/login/begin",
            content: null,
            cancellationToken);

    beginResponse.EnsureSuccessStatusCode();

    var requestOptionsJson =
        await beginResponse.Content.ReadAsStringAsync(
            cancellationToken);

    var assertion =
        await Passkeys.AssertAsync(
            requestOptionsJson,
            cancellationToken);

    using var content = new StringContent(
        assertion.ToString(),
        Encoding.UTF8,
        "application/json");

    using var finishResponse =
        await httpClient.PostAsync(
            "/passkeys/login/finish",
            content,
            cancellationToken);

    finishResponse.EnsureSuccessStatusCode();

    return await finishResponse.Content
        .ReadFromJsonAsync<AuthTokens>(
            cancellationToken)
        ?? throw new InvalidOperationException(
            "The server didn't return authentication tokens.");
}
```

Again, `AssertAsync()` is where the native UI appears.

And again, the app doesn't verify the result. It sends it back to the server.

## Step 7: verify the assertion and issue your normal tokens

Here's one place where I'd deliberately diverge from the MAUI sample.

The sample calls:

```csharp
await signInManager.PasskeySignInAsync(...)
```

and uses an ASP.NET Core authentication cookie. That's perfectly reasonable for a sample and also perfectly reasonable for a cookie-based web application. The PR itself points out that the sample's cookie-based native authentication setup is there for convenience rather than being a recommendation for production mobile applications.

If our existing mobile API normally returns an access token and refresh token, I'd keep doing exactly that. ASP.NET Core Identity also exposes `PerformPasskeyAssertionAsync()`, which verifies the passkey without automatically creating the cookie-based login session.

That gives us something along these lines:

```csharp
app.MapPost("/passkeys/login/finish", async (
    JsonElement credential,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ITokenService tokenService) =>
{
    var assertion =
        await signInManager.PerformPasskeyAssertionAsync(
            credential.GetRawText());

    if (!assertion.Succeeded ||
        assertion.User is null ||
        assertion.Passkey is null)
    {
        return Results.Unauthorized();
    }

    // Persist any updated passkey data, including the
    // authenticator's updated signature counter.
    var updateResult =
        await userManager.AddOrUpdatePasskeyAsync(
            assertion.User,
            assertion.Passkey);

    if (!updateResult.Succeeded)
        return Results.BadRequest();

    // Run the same account/lockout/policy checks your
    // normal authentication flow performs here.

    var tokens =
        await tokenService.CreateTokensAsync(
            assertion.User);

    return Results.Ok(tokens);
});
```

That's an important architectural point. Passkeys don't need to replace your authentication system. They're another way of proving who the user is. Once the server has successfully verified that proof, you can feed the resulting user into the same token/session machinery you already use.

ASP.NET Core's lower-level assertion API is specifically available for cases where you need that extra control. It also requires you to persist the returned updated passkey information yourself.

## One slightly annoying detail: keep the ceremony state

There is another bit in the sample that's easy to overlook. The `/begin` and `/finish` calls belong to the same WebAuthn ceremony.

ASP.NET Core Identity stores temporary passkey state so that when the response comes back it can confirm it corresponds to the challenge that was originally generated.

The MAUI sample preserves that state using an `HttpClient` backed by a `CookieContainer`:

```csharp
var handler = new HttpClientHandler
{
    CookieContainer = new CookieContainer(),
    UseCookies = true
};

var httpClient = new HttpClient(handler)
{
    BaseAddress = new Uri("https://auth.example.com/")
};
```

That doesn't mean your application's main authentication mechanism needs to use cookies. Your normal API requests can still use:

```http
Authorization: Bearer ...
```

The cookie here can simply correlate the short-lived WebAuthn ceremony.

If your authentication infrastructure already has another mechanism for storing challenge state such as a server-side ceremony ID, you can use that instead. What matters is that `/finish` can securely recover the state created by the corresponding `/begin`.

Lose that and verification should fail.

## Apple needs Associated Domains

We're not quite done. This stuff deliberately won't work just because you've pointed an app at a server. On Apple platforms, your application needs the Associated Domains entitlement:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>webcredentials:auth.example.com</string>
</array>
```

And your server needs to expose:

```text
https://auth.example.com/.well-known/apple-app-site-association
```

with something like:

```json
{
  "webcredentials": {
    "apps": [
      "ABCDE12345.com.example.myapp"
    ]
  }
}
```

where the value is your:

```text
<Team ID>.<Bundle ID>
```

The app must also be signed with a provisioning profile that includes Associated Domains. Apple then checks that the application's entitlement and the domain's association file agree before allowing the app to create or use a passkey for that domain.

## Android needs Digital Asset Links

Android has a similar relationship. Your authentication domain needs:

```text
https://auth.example.com/.well-known/assetlinks.json
```

containing the package and signing certificate allowed to use credentials for that domain:

```json
[
  {
    "relation": [
      "delegate_permission/common.get_login_creds"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.myapp",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:..."
      ]
    }
  }
]
```

The certificate fingerprint needs to be for the certificate actually signing your production application. Not your debug certificate. 

That seems obvious when written down here. It'll feel slightly less obvious when you've spent an afternoon wondering why the thing worked perfectly in development.

Also worth knowing: the MAUI implementation deliberately uses the OS-native Android Credential Manager path and doesn't pull Google Play Services into Essentials. As a result, the built-in implementation starts at Android 14/API 34. Support for Android 9–13 can potentially be added by the application through the Play Services Credential Manager adapter, but MAUI doesn't force that dependency on everybody.
## A useful extra: keep the authentication local

There is one extra option in the new API that I quite like. Rather than using the convenient string overload:

```csharp
await Passkeys.AssertAsync(requestOptionsJson);
```

you can construct the options yourself:

```csharp
var options = new PasskeyRequestOptions(
    requestOptionsJson)
{
    PreferImmediatelyAvailable = true
};

var assertion =
    await Passkeys.AssertAsync(options);
```

`PreferImmediatelyAvailable` tells Android and Apple to only offer a credential that's immediately available on this device rather than falling through into the cross-device flows involving QR codes or another nearby device.

If there isn't one, the operation fails quickly.

I can see this being particularly useful when a passkey button is one option amongst several on a login screen and you don't want pressing it to start an entire "find another device" adventure.

## Handle cancellation properly

Passkey UI is also cancellable. I'd make sure your ViewModel doesn't treat somebody closing Face ID as if the authentication server has exploded:

```csharp
try
{
    await passkeyService.SignInWithPasskeyAsync(
        cancellationToken);
}
catch (TaskCanceledException)
{
    // The user cancelled. That's fine.
}
catch (FeatureNotSupportedException)
{
    // Fall back to your other login methods.
}
catch (ArgumentException ex)
{
    // Bad WebAuthn options from the server.
}
catch (InvalidOperationException ex)
{
    // No credential, association problem or
    // another platform ceremony failure.
}
```

MAUI deliberately normalises the platform-specific errors into normal .NET exception types, with `TaskCanceledException` representing both user and programmatic cancellation.

## What I'd actually ship

Once you strip the sample plumbing away, the shape of this isn't particularly frightening.

For registration:

```text
Authenticated user
    ↓
POST /passkeys/register/begin
    ↓
Passkeys.CreateAsync()
    ↓
POST /passkeys/register/finish
    ↓
Server verifies + stores public credential
```

For authentication:

```text
POST /passkeys/login/begin
    ↓
Passkeys.AssertAsync()
    ↓
POST /passkeys/login/finish
    ↓
Server verifies credential
    ↓
Existing access/refresh token flow
```

Then add the platform-domain association required by Apple and Android.

That's it.

There is obviously security-sensitive machinery underneath all of this. WebAuthn challenges, signatures, attestation, credential IDs, origins, relying-party IDs and replay protection. . . but that's precisely why I like the design.

The MAUI app isn't expected to understand most of it.

It asks the server what the authenticator should do:

```csharp
var options = await server.BeginPasskeyLoginAsync();
```

lets the operating system do it:

```csharp
var response = await Passkeys.AssertAsync(options);
```

and asks the server whether the result is legitimate:

```csharp
await server.FinishPasskeyLoginAsync(
    response.ToString());
```

That's a pretty good abstraction. And perhaps more importantly, it means we can now put a genuinely native passkey login in a .NET MAUI application without writing separate integrations for AuthenticationServices, Android Credential Manager and Windows WebAuthn.

That's the sort of Essentials API I like.

Small on the surface.

A frankly unreasonable amount of platform-specific faff underneath it.

And none of that faff needs to be in my my code.

### Useful links

The implementation landed in .NET MAUI through [PR #36837 — Passkeys (WebAuthn/FIDO2) Essentials API](https://github.com/dotnet/maui/pull/36837).

Microsoft has also published the full [MAUI Passkeys sample README](https://github.com/dotnet/maui/blob/release/11.0.1xx-preview7/src/Essentials/samples/README-Passkeys.md) and the [reference ASP.NET Core backend](https://github.com/dotnet/maui/tree/release/11.0.1xx-preview7/src/Essentials/samples/Samples.Server.Passkeys).