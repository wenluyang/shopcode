<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "{{%admin_role}}".
 *
 * @property int $id
 * @property int $uid 管理员ID
 * @property int $role_id 角色ID
 * @property string $created_time 创建时间
 */
class AdminRole extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%admin_role}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['uid', 'role_id'], 'required'],
            [['uid', 'role_id'], 'integer'],
            [['created_time'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'uid' => 'Uid',
            'role_id' => 'Role ID',
            'created_time' => 'Created Time',
        ];
    }
}
