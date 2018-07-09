i18n-yii2
=========

Translation substitution in [Yii2 manner][yii2-i18n]:

Usage
-----

```js
import i18n from 'i18n-yii2';

console.log(i18n.t('category', 'Test message'));
console.log(i18n.t('category/subcategory', 'Hello, {name}', {name: 'Mr. Smith'}));
```

Configuration
-------------

### Predefined global `I18N_CONFIG`

Assign global variable with name `I18N_CONFIG` before module loaded:

```html
<script>
const I18N_CONFIG = {
    language: 'ru-RU',
    translations: {
        'ru-RU': {
            'category': {
                'Test message': 'Тестовое сообщение',
            },
            'category/subcategory': {
                'Hello, {name}': 'Здравствуйте, {name}',
            },
        },
    },
};
</script>
```

### Runtime

Pass config to `i18n.configure()` method:

```js
import i18n from 'i18n-yii2';

i18n.configure({
    ...
});
```

License
-------

This package is under [MIT License][mit]


[mit]: https://opensource.org/licenses/MIT
[yii2-i18n]: https://www.yiiframework.com/doc/guide/2.0/en/tutorial-i18n
