---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-self-closing
description: enforce self-closing style
since: v3.11.0
---

# vue/html-self-closing

> enforce self-closing style

- :gear: This rule is included in all of `"plugin:vue/strongly-recommended"`, `*.configs["flat/strongly-recommended"]`, `"plugin:vue/vue2-strongly-recommended"`, `*.configs["flat/vue2-strongly-recommended"]`, `"plugin:vue/recommended"`, `*.configs["flat/recommended"]`, `"plugin:vue/vue2-recommended"` and `*.configs["flat/vue2-recommended"]`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce the self-closing sign as the configured style.

In Vue.js template, we can use either two styles for elements which don't have their content.

1. `<YourComponent></YourComponent>`
2. `<YourComponent/>` (self-closing)

Self-closing is simple and shorter, but it's not supported in the HTML spec.

<eslint-code-block fix :rules="{'vue/html-self-closing': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div/>
  <img>
  <MyComponent/>
  <svg><path d=""/></svg>

  <!-- ✗ BAD -->
  <div></div>
  <img/>
  <MyComponent></MyComponent>
  <svg><path d=""></path></svg>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-self-closing": ["error", {
    "html": {
      "void": "never",
      "normal": "always",
      "component": "always"
    },
    "svg": "always",
    "math": "always"
  }]
}
```

- `html.void` (`"never"` by default) ... The style of well-known HTML void elements.
- `html.normal` (`"always"` by default) ... The style of well-known HTML elements except void elements.
- `html.component` (`"always"` by default) ... The style of Vue.js custom components.
- `svg`(`"always"` by default) .... The style of well-known SVG elements.
- `math`(`"always"` by default) .... The style of well-known MathML elements.

Every option can be set to one of the following values:

- `"always"` ... Require self-closing at elements which don't have their content.
- `"never"` ... Disallow self-closing.
- `"any"` ... Don't enforce self-closing style.

### `html: {normal: "never", void: "always"}`

<eslint-code-block fix :rules="{'vue/html-self-closing': ['error', {html: {normal: 'never', void: 'always'}}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div></div>
  <img/>
  <MyComponent/>
  <svg><path d=""/></svg>

  <!-- ✗ BAD -->
  <div/>
  <img>
  <MyComponent></MyComponent>
  <svg><path d=""></path></svg>
</template>
```

</eslint-code-block>

## :books: Further Reading

- [Style guide - Self closing components](https://vuejs.org/style-guide/rules-strongly-recommended.html#self-closing-components)

## :rocket: Version

This rule was introduced in eslint-plugin-vue v3.11.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-self-closing.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-self-closing.js)
