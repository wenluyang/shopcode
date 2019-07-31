<?php



$urlRuleConfigs = [
    [
        'controller' => ['admin/admin'],
        'extraPatterns' => [
            'POST login' => 'login',
            'POST add' => 'add',
            'POST edit' => 'edit',
            'POST delete' => 'delete',

        ],
    ],
];


/**
 * 基本的url规则配置
 */
function baseUrlRules($unit)
{
    $config = [
        'class' => 'yii\rest\UrlRule',
    ];
    return array_merge($config, $unit);
}

return array_map('baseUrlRules', $urlRuleConfigs);