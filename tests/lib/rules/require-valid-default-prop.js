/**
 * @fileoverview Enforces props default values to be valid.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/require-valid-default-prop')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')
const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module',
  parserOptions: {
    ecmaFeatures: { jsx: true }
  }
}

function errorMessage(type) {
  return [
    {
      message: `Type of the default value for 'foo' prop must be a ${type}.`,
      line: 5
    }
  ]
}

function errorMessageForFunction(type) {
  return [
    {
      message: `Type of the default value for 'foo' prop must be a ${type}.`,
      line: 6
    }
  ]
}

const ruleTester = new RuleTester()
ruleTester.run('require-valid-default-prop', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `export default {
        ...foo,
        props: { ...foo }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: { foo: null }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: ['foo']
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Object, Number],
            default: 10
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('example', {
        props: {
          foo: null,
          foo: Number,
          foo: [String, Number],
          foo: { },
          foo: { type: String },
          foo: { type: Number, default: VAR_BAR },
          foo: { type: Number, default: 100 },
          foo: { type: Number, default: Number.MAX_VALUE },
          foo: { type: Number, default: Foo.BAR },
          foo: { type: {}, default: '' },
          foo: { type: [String, Number], default: '' },
          foo: { type: [String, Number], default: 0 },
          foo: { type: String, default: '' },
          foo: { type: String, default: \`\` },
          foo: { type: Boolean, default: false },
          foo: { type: Object, default: () => { } },
          foo: { type: Array, default () { } },
          foo: { type: String, default () { } },
          foo: { type: Number, default () { } },
          foo: { type: Boolean, default () { } },
          foo: { type: Symbol, default () { } },
          foo: { type: Array, default () { } },
          foo: { type: Symbol, default: Symbol('a') },
          foo: { type: String, default: \`Foo\` },
          foo: { type: Foo, default: Foo('a') },
          foo: { type: String, default: \`Foo\` },
          foo: { type: BigInt, default: 1n },
          foo: { type: String, default: null },
          foo: { type: String, default () { return Foo } },
          foo: { type: Number, default () { return Foo } },
          foo: { type: Object, default () { return Foo } },
          foo: { type: Object, default: null },
        }
      })`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {
              type: [Object, Number],
              default: 10
            } as PropOptions<object>
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number],
            default() {
              return 10
            }
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Function, Number],
            default() {
              return 's'
            }
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number],
            default: () => 10
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Function, Number],
            default: () => 's'
          }
        }
      }`,
      languageOptions
    },

    // sparse array
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [,Object, Number],
            default: 10
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: Number?.()
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Array as PropType<string[]>,
              default: () => []
            }
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ...languageOptions
      }
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Object as PropType<{ [key: number]: number }>,
              default: () => {}
            }
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Function as PropType<() => number>,
              default: () => 10
            }
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1853
      filename: 'test.vue',
      code: `<script setup lang="ts">
      export interface SomePropInterface {
        someProp?: false | string;
        str?: 'foo' | 'bar';
        num?: 1 | 2;
      }

      withDefaults(defineProps<SomePropInterface>(), {
        someProp: false,
        str: 'foo',
        num: 1
      });
      </script>`,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      code: `
      <script setup lang="ts">
      import {Props2 as Props} from './test01'
      withDefaults(defineProps<Props>(), {
        a: 's',
        b: 42,
        c: true,
        d: false,
        e: 's',
        f: () => 42,
        g: ()=>({ foo: 'foo' }),
        h: ()=>(['foo', 'bar']),
        i: ()=>(['foo', 'bar']),
      })
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = 'abc' } = defineProps({
          foo: {
            type: String,
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        const { foo = [] } = defineProps({
          foo: {
            type: Array,
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      }
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2692
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      type MaybeString<T extends number> = T | \`\${T}\`
      const { foo = 1 } = defineProps<{ foo: MaybeString<1, 2>}>()
      </script>
      `,
      ...getTypeScriptFixtureTestOptions()
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number, String],
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('number or string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Number, Object],
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('number or function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: ''
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: false
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: []
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: 2
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: []
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: ''
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: 5
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Boolean,
            default: []
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('boolean')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: ''
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: 55
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: false
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: []
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: ''
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: 55
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: false
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Array,
            default: []
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [Object, Number],
            default: {}
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function or number')
    },
    {
      filename: 'test.vue',
      code: `export default (Vue as VueConstructor<Vue>).extend({
        props: {
          foo: {
            type: [Object, Number],
            default: {}
          } as PropOptions<object>
        }
      });`,

      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: errorMessage('function or number')
    },

    {
      filename: 'test.vue',
      code: `export default {
        props: {
          'foo': {
            type: Object,
            default: ''
          },
          ['bar']: {
            type: Object,
            default: ''
          },
          [baz]: {
            type: Object,
            default: ''
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: `Type of the default value for 'foo' prop must be a function.`,
          line: 5
        },
        {
          message: `Type of the default value for 'bar' prop must be a function.`,
          line: 9
        },
        {
          message: `Type of the default value for '[baz]' prop must be a function.`,
          line: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: 1n
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default() {
              return ''
            }
          }
        }
      }`,
      languageOptions,
      errors: errorMessageForFunction('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default() {
              return ''
            }
          }
        }
      }`,
      languageOptions,
      errors: errorMessageForFunction('object')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default() {
              return 123
            }
          }
        }
      }`,
      languageOptions,
      errors: errorMessageForFunction('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: () => {
              return ''
            }
          }
        }
      }`,
      languageOptions,
      errors: errorMessageForFunction('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: () => {
              return ''
            }
          }
        }
      }`,
      languageOptions,
      errors: errorMessageForFunction('object')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: () => {
              return 123
            }
          }
        }
      }`,
      languageOptions,
      errors: errorMessageForFunction('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Number,
            default: () => ''
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('number')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Object,
            default: () => ''
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('object')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: () => 123
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: Function,
            default: 1
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: [String, Boolean],
            default() {
              switch (kind) {
                case 1: return 1
                case 2: return '' // OK
                case 3: return {}
                case 4: return Foo // ignore?
                case 5: return () => {}
                case 6: return false // OK
              }

              function foo () {
                return 1 // ignore?
              }
            }
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message:
            "Type of the default value for 'foo' prop must be a string or boolean.",
          line: 7
        },
        {
          message:
            "Type of the default value for 'foo' prop must be a string or boolean.",
          line: 9
        },
        {
          message:
            "Type of the default value for 'foo' prop must be a string or boolean.",
          line: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default {
        props: {
          foo: {
            type: String,
            default: Number?.()
          }
        }
      }`,
      languageOptions,
      errors: errorMessage('string')
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Array as PropType<string[]>,
              default: []
            }
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Object as PropType<{ [key: number]: number }>,
              default: {}
            }
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `export default Vue.extend({
          props: {
            foo: {
              type: Function as PropType<() => number>,
              default: 10
            }
          }
        });
      `,
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: errorMessage('function')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineProps({
          foo: {
            type: String,
            default: () => 123
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        withDefaults(defineProps<{foo:string}>(),{
          foo: () => 123
        })
      </script>
      `,
      languageOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 4
        }
      ]
    },
    {
      code: `
      <script setup lang="ts">
      import {Props2 as Props} from './test01'
      withDefaults(defineProps<Props>(), {
        a: 42,
        b: 's',
        c: {},
        d: [],
        e: [42],
        f: {},
        g: { foo: 'foo' },
        h: ['foo', 'bar'],
        i: ['foo', 'bar'],
      })
      </script>`,
      errors: [
        {
          message: "Type of the default value for 'a' prop must be a string.",
          line: 5
        },
        {
          message: "Type of the default value for 'b' prop must be a number.",
          line: 6
        },
        {
          message: "Type of the default value for 'c' prop must be a boolean.",
          line: 7
        },
        {
          message: "Type of the default value for 'd' prop must be a boolean.",
          line: 8
        },
        {
          message:
            "Type of the default value for 'e' prop must be a string or number.",
          line: 9
        },
        {
          message: "Type of the default value for 'f' prop must be a function.",
          line: 10
        },
        {
          message: "Type of the default value for 'g' prop must be a function.",
          line: 11
        },
        {
          message: "Type of the default value for 'h' prop must be a function.",
          line: 12
        },
        {
          message: "Type of the default value for 'i' prop must be a function.",
          line: 13
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = 123 } = defineProps({
          foo: String
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = 123 } = defineProps({
          foo: {
            type: String,
            default: 123
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 3
        },
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = [] } = defineProps({
          foo: {
            type: Number,
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a number.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = 42 } = defineProps({
          foo: {
            type: Array,
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a array.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = [] } = defineProps({
          foo: {
            type: Array,
            default: () => {
              return 42
            }
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a array.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const { foo = (()=>[]) } = defineProps({
          foo: {
            type: Array,
          }
        })
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser')
      },
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a array.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      type MaybeString<T extends string | number> = \`\${T}\`
      const { foo = 1 } = defineProps<{ foo: MaybeString<1, 2>}>()
      </script>
      `,
      errors: [
        {
          message: "Type of the default value for 'foo' prop must be a string.",
          line: 4
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    }
  ]
})
