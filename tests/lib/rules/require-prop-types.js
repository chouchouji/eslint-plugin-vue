/**
 * @fileoverview Prop definitions should be detailed
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/require-prop-types')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()
ruleTester.run('require-prop-types', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo,
          props: {
            ...test(),
            foo: String
          }
        }
      `,
      parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: [String, Number]
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: String
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              ['type']: String
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              validator: v => v
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              ['validator']: v => v
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: externalProps
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: []
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {}
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {
              type: String
            } as PropOptions<string>
          }
        });
      `,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          props: {
            foo: {
              type: String
            } as PropOptions<string>
          }
        });
      `,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: String
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{foo:string}>()
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      code: `
      <script setup lang="ts">
      import {Props1 as Props} from './test01'
      defineProps<Props>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel({type:String})
      const foo = defineModel('foo', {type:String})
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel(String)
      const foo = defineModel('foo', String)
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      code: `
      <script setup lang="ts">
      const m = defineModel<string>()
      const foo = defineModel<string>('foo')
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo', bar, \`baz\`, foo()]
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "bar" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "baz" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "Unknown prop" should define at least its type.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          props: ['foo', bar, \`baz\`, foo()]
        })
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "bar" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "baz" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "Unknown prop" should define at least its type.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: {
              type: []
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo() {}
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          props: {
            foo: {} as PropOptions<string>
          }
        });
      `,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default (Vue as VueConstructor<Vue>).extend({
          props: {
            foo: {} as PropOptions<string>
          }
        });
      `,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {}
      })
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo'])
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Prop "foo" should define at least its type.',
          line: 3
        }
      ]
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel()
      const foo = defineModel('foo')
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          message: 'Prop "modelValue" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    },
    {
      // defineModel
      code: `
      <script setup>
      const m = defineModel({})
      const foo = defineModel('foo',{})
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          message: 'Prop "modelValue" should define at least its type.',
          line: 3
        },
        {
          message: 'Prop "foo" should define at least its type.',
          line: 4
        }
      ]
    }
  ]
})
