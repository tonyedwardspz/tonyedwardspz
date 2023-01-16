---
title: Polymer element is unregistered
tag:
  - Polymer
  - Tutorial
  - Web Development
---
[Polymer](http://www.polymer-project.org/) is the hot new library from Google for creating modular websites. The library offers syntactic sugar for creating web components, little bundles of HTML, CSS and JavaScript. Whilst Polymer goes a long way to making web components easy, theres one issue I kept coming across during my early days of working with the library. The dreaded unregistered element.

An unregistered element is apparent when an element you are using is not rendering, preventing it from being displayed on the page. In some edge cases it can cause the entire page to display as blank, often dubbed the white screen of death.

[Aleks Totic](https://twitter.com/atotic) and [Eric Bidelman](https://twitter.com/ebidel), both contributors to Polymer, created an excellent bookmarklet for testing if there is an unregistered element present on the page. Whilst its not always accurate, especially in complex page structures, it should be the starting point of your bug hunt. You can find the bookmarklet [here](https://gist.github.com/ebidel/cea24a0c4fdcda8f8af2).

There are a few reasons that this you might be getting an unregistered element.

## Missing / on closing template tag

In this example, the `/` has been missed off of the closing template tag.

    <span class="tag"><template</span> <span class="atn">is</span><span class="pun">=</span><span class="atv">"dom-repeat"</span> <span class="atn">items</span><span class="pun">=</span><span class="atv">"{{driverList}}"</span><span class="tag">>
    </span><span class="tag">&nbsp; &nbsp; <span></span><span class="pln">[[item.Driver.givenName]]</span><span class="tag"></span>
    </span><span class="tag">&nbsp; &nbsp; <span></span><span class="pln">[[item.Driver.familyName]]</span><span class="tag"></span></span>
    <span class="tag"><template></span>

Which would become. . .

    <template is="dom-repeat" items="{{driverList}}">
        <span>[[item.Driver.givenName]]</span>
        <span>[[item.Driver.familyName]]</span>
    </template>

Simples.

## Mismatched element name

The id that you give the `dom-module` must match the one that is instantiated by the Polymer call. The following example results in an unregistered element due to this mismatch.

    <dom-module id="driver-standing">
      // Other code
      <script>
        (function() {
          'use strict';
          Polymer({
            is: 'constructor-standing'
          })();
       </script>
    </dom-module>

Whereas the following would be fine.

    <dom-module id="driver-standing">
      // Other code
      <script>
        (function() {
          'use strict';
          Polymer({
            is: 'driver-standing'
          })();
      </script>
    </dom-module>

## Incomplete HTML imports

Another possibility is an incomplete or missing html import. In a recent project I had the unregistered element error because of the following import.

    <link rel="import" href="../../bower_components/paper-fab/paper-fab">

I'd forgotten to include `.html` at the end of the file path. The corrected import looked like this:

    <link rel="import" href="../../bower_components/paper-fab/paper-fab.html">

## Missing a dash in the element name

All Polymer elements require a dash in the tag name to differentiate it's self from the native HTML elements.

This example shows an invalid element name:

    <dom-module id="driverStanding">

With this as its valid counterpart:

    <dom-module id="driver-standing">

## Summary

This has been a quick summary of three possible causes of an unregistered elements when using the Polymer library. If you know of another cause, [drop me a message](http://twitter.com/tonyedwardspz) and I'll add it to the list.
