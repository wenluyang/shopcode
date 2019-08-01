<?php


$urlRuleConfigs = [
    [
        'controller' => ['admin/admin','admin/role'],
        'extraPatterns' => [
            'POST,OPTIONS login' => 'login',
            'POST,OPTIONS add' => 'add',
            'POST,OPTIONS edit' => 'edit',
            'POST,OPTIONS remove' => 'remove',
            'POST,OPTIONS list' => 'list',
            'GET,OPTIONS getone' => 'getone',
            'GET,OPTIONS getselectlist' => 'getselectlist',

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