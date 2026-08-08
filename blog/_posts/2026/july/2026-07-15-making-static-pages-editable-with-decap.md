---
title: Making static Astro pages editable with Decap
tag:
    - programming
omit: true
---

I recently added Decap CMS to an Astro site that already had an ordinary collection of articles. That bit was straightforward enough: articles all share roughly the same shape, so they fit neatly into a folder-based content collection.

Then came the static pages.

The homepage had a hero and a short introduction. The About page had similar introductory content, plus a list of things the organisation stands for. The copy was hardcoded directly into the `.astro` templates, which meant every wording change needed a developer, a code edit and a deployment.

Less than ideal for changing a sentence.

The goal was to make those pages editable through Decap without turning the CMS configuration into a giant generic page builder. I also didn’t want About-specific fields appearing in the homepage editor simply because both happened to be pages.

The approach I settled on was:

- one Markdown content entry for each static page
- one Astro content collection for each page type
- one Decap file collection containing the individual page editors
- the existing Astro templates left largely intact

It’s a small amount of wiring, keeps the types useful and gives editors a clean form containing only the fields they actually need.

## Why use a file collection?

Decap supports both folder collections and file collections.

Folder collections are a good fit for repeatable content such as articles, products or team members. Each entry has the same fields, and editors can usually create more of them.

A file collection works differently. Each entry points to a specific file and can define its own set of fields. Decap’s documentation specifically calls out custom landing pages and other uniquely structured files as a good use case.

That matched what I needed.

There is only one homepage. I don’t want an editor merrily creating `homepage-2.md`, however tempting the sequel might be.

The About page also has a slightly different content model from the homepage. Keeping it as a separate file definition means its list fields stay in its editor rather than leaking into every other page.

The resulting structure looked like this:

```text
src/
├── content/
│   ├── articles/
│   ├── homepage/
│   │   └── index.md
│   └── about/
│       └── index.md
├── content.config.ts
└── pages/
    ├── index.astro
    └── about-us.astro

public/
└── admin/
    └── config.yml
```

## 1. Define the Astro content collections

Astro content collections let you define the expected shape of your content and then query it through APIs such as `getEntry()`.

For local Markdown files, Astro provides a `glob()` loader. You give it a base directory and a pattern, then add a schema to validate the frontmatter. The schema also supplies TypeScript types and editor autocomplete when you use the content later.

Here’s a deliberately small example:

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const homepage = defineCollection({
  loader: glob({
    pattern: "index.md",
    base: "./src/content/homepage",
  }),
  schema: z.object({
    pageTitle: z.string(),
    heroHeading: z.string(),
    introduction: z.string(),
  }),
});

const about = defineCollection({
  loader: glob({
    pattern: "index.md",
    base: "./src/content/about",
  }),
  schema: z.object({
    pageTitle: z.string(),
    heroHeading: z.string(),
    standForItems: z.array(z.string()).min(1),
  }),
});

export const collections = {
  homepage,
  about,
};
```

There are two collections even though each contains only one entry.

That might look slightly over-organised at first, but it gives each page its own schema. The homepage doesn’t need to know what a `standForItem` is, and the About page can require at least one of them.

You could create one enormous `pages` schema with a pile of optional fields:

```ts
standForItems: z.array(z.string()).optional()
```

Do that a few more times, though, and you end up with a schema that doesn’t properly describe any of your pages. Everything is technically allowed everywhere, and the types stop protecting you from much.

Separate schemas are a little more verbose but much clearer.

One small version-related detail: current Astro documentation imports Zod from `astro/zod`. Older projects and examples may use a different import, so follow the convention used by the Astro version installed in your project.

## 2. Move the page copy into Markdown

Next, create the actual content entries.

For the homepage:

```md
---
pageTitle: Cornwall Self-Catering Collective
heroHeading: One voice for self-catering in Cornwall
introduction: We represent professional self-catering agencies across Cornwall.
---
```

Save that as:

```text
src/content/homepage/index.md
```

Then create the About page:

```md
---
pageTitle: About us
heroHeading: A collective voice for responsible self-catering
standForItems:
  - Professional standards
  - Responsible tourism
  - Strong local communities
---
```

Save that as:

```text
src/content/about/index.md
```

The filenames matter because Astro derives the entry ID from the filename when using the `glob()` loader. In this case, both entry IDs are `index`.

That becomes important when we load them in the page templates.

The frontmatter names must also match the Zod schemas exactly. `heroHeading` and `hero_heading` may look like close relatives to a human, but they are not the same field to Astro.

## 3. Add the pages to Decap CMS

Decap’s main configuration normally lives in the admin directory, commonly as `public/admin/config.yml` in an Astro project. Collections define what appears in the editor and which files Decap updates.

Add a file-based collection for the static pages:

```yml
collections:
  - name: pages
    label: Pages
    files:
      - label: Homepage
        name: homepage
        file: src/content/homepage/index.md
        fields:
          - { label: Page title, name: pageTitle, widget: string }
          - { label: Hero heading, name: heroHeading, widget: string }
          - { label: Introduction, name: introduction, widget: text }

      - label: About us
        name: about
        file: src/content/about/index.md
        fields:
          - { label: Page title, name: pageTitle, widget: string }
          - { label: Hero heading, name: heroHeading, widget: string }
          - label: What we stand for
            name: standForItems
            widget: list
            field:
              label: Item
              name: item
              widget: string
```

The `file` value is relative to the root of the repository, not the `admin` directory.

Each page gets its own `fields` block. That’s the useful bit: the homepage editor contains only homepage fields, while the About editor gets its repeatable list.

Decap widgets control both the editing interface and the type of data that gets written. The `string` widget is suited to shorter values, while `text` provides a multiline field.

For `standForItems`, I used a `list` widget with one repeated string field. This lets the editor add, remove and reorder items without editing YAML by hand.

The `name` values in Decap must match the names in your Markdown frontmatter and your Astro schema:

```text
Decap config
    ↓
Markdown frontmatter
    ↓
Astro schema
    ↓
Astro template
```

A mismatch anywhere along that chain will either produce a validation error or leave you wondering why your newly edited heading has disappeared into the void.

## 4. Load the content in the Astro page

The homepage previously contained hardcoded content:

```astro
<h1>One voice for self-catering in Cornwall</h1>

<p>
  We represent professional self-catering agencies across Cornwall.
</p>
```

Replace the hardcoded values with a content entry.

In `src/pages/index.astro`:

```astro
---
import { getEntry } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";

const homepage = await getEntry("homepage", "index");

if (!homepage) {
  throw new Error(
    "Missing homepage content at src/content/homepage/index.md"
  );
}

const { data } = homepage;
---

<BaseLayout title={data.pageTitle}>
  <h1>{data.heroHeading}</h1>
  <p>{data.introduction}</p>
</BaseLayout>
```

`getEntry()` takes the collection name followed by the entry ID. Astro exposes this function specifically for retrieving a known item from a build-time content collection.

Because the file is called `index.md`, the entry ID is `index`:

```ts
getEntry("homepage", "index");
```

Not:

```ts
getEntry("homepage", "homepage");
```

I added an explicit error when the entry is missing. You could use optional chaining and quietly render nothing, but that tends to turn a straightforward content problem into a slightly tedious layout investigation.

Failing with the exact missing path is much more useful.

## 5. Do the same for the About page

The About page follows the same pattern:

```astro
---
import { getEntry } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";

const about = await getEntry("about", "index");

if (!about) {
  throw new Error(
    "Missing about content at src/content/about/index.md"
  );
}

const { data } = about;
---

<BaseLayout title={data.pageTitle}>
  <h1>{data.heroHeading}</h1>

  <ul>
    {data.standForItems.map((item) => <li>{item}</li>)}
  </ul>
</BaseLayout>
```

The existing HTML structure, classes and components can stay as they are. You are changing the source of the copy, not rebuilding the page.

That distinction kept this change pleasantly contained. The CSS didn’t care whether a heading came from a string inside the template or from `data.heroHeading`.

## 6. Test the full editing loop

A successful build proves that the schemas and imports are valid, but it doesn’t prove that an editor can actually change the content.

I checked the entire loop:

1. Start the Astro development server.
2. Start Decap’s local development setup, if you use one.
3. Open `/admin/`.
4. Edit the homepage heading and save it.
5. Confirm that `src/content/homepage/index.md` changed.
6. Refresh the homepage and check the new text.
7. Edit the About page list.
8. Confirm that the list renders correctly.
9. Run a production build.

In this project, the commands were:

```bash
pnpm dev
pnpm cms
pnpm build
```

Your CMS command may differ depending on how local Decap development has been configured.

The important test is not merely that the CMS says “saved”. Check the underlying Markdown file. Decap writes content into the repository through its configured backend; it is not the system that renders the final website. Astro still needs to read that content and build the page.

A final production build is worth doing because Astro’s schema validation catches missing fields and incorrect content types before the site is deployed.

In my case, the build passed after the templates and collections were wired together. Happy days.

## Adding another static page

Once the pattern is in place, adding another page is mostly repetition.

For a contact page, for example:

1. Create `src/content/contact/index.md`.
2. Add a `contact` collection to `src/content.config.ts`.
3. Add a Contact entry under `collections.pages.files` in Decap.
4. Load it with `getEntry("contact", "index")`.
5. Replace the hardcoded template values with `data` properties.
6. Run the CMS and production build checks.

It isn’t a fully dynamic page builder, and that is quite deliberate.

Editors can change the content you have chosen to expose, while the Astro templates retain control over the markup, layout and design. For this site, that was a much better fit than allowing arbitrary sections to be assembled in the CMS.

## A few easy mistakes

### Using different field names

This is the most likely one.

These must all agree:

```text
config.yml:          heroHeading
Markdown:            heroHeading
content.config.ts:   heroHeading
Astro template:      data.heroHeading
```

Pick a naming convention and stick to it.

### Using the wrong entry ID

With an entry stored as `index.md`, the ID generated by the glob loader is `index`.

Use:

```ts
await getEntry("about", "index");
```

### Forgetting that file entries must exist

A Decap file collection points to known files. Those files need to exist in the configured repository branch before Decap can edit them.

Create and commit the Markdown files rather than expecting Decap to invent them on first use.

### Making one universal schema too early

A shared schema can make sense when several pages genuinely use the same content model.

It is less useful when it becomes a bucket of optional properties:

```ts
heroHeading: z.string().optional(),
standForItems: z.array(z.string()).optional(),
contactDetails: z.object({}).optional(),
mapLocation: z.string().optional(),
```

At that point the schema is mostly documenting that anything might be there.

Start with page-specific schemas. Pull shared parts out later when repetition becomes real rather than theoretical.

## Was it worth it?

This approach adds a few files and a little configuration, but it gives the site a useful middle ground.

The content team can edit the pages through Decap. Astro still owns the templates and styling. Zod checks that the saved content has the shape the templates expect. Page-specific fields remain page-specific.

It won’t cover every possible CMS setup, particularly sites that need flexible visual page building or deeply nested content blocks. For a handful of designed static pages, though, a file collection backed by small Astro content collections is simple, typed and easy to extend.

More importantly, changing a homepage heading no longer requires opening a code editor.. . which was kinda the point.
