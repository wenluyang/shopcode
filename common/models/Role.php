<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "{{%role}}".
 *
 * @property int $id
 * @property string $name 角色名称
 * @property int $status 状态 1 为启用 0 为禁用
 * @property string $updated_time 更新时间
 * @property string $created_time 创建时间
 */
class Role extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%role}}';
    }




}
