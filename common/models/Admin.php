<?php

namespace common\models;

use Yii;
use yii\web\IdentityInterface;

/**
 * This is the model class for table "{{%admin}}".
 *
 * @property int $id
 * @property string $username 用户名
 * @property string $password 密码
 * @property string $password_hash 盐值
 * @property string $phone 电话
 * @property string $email 邮箱
 * @property string $access_token
 * @property string $create_time 创建时间
 * @property string $auth_key
 */
class Admin extends \yii\db\ActiveRecord implements IdentityInterface
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return '{{%admin}}';
    }

    /**
     * 根据用户名查找用户
     * Finds an identity by username
     * @param null $username
     * @return null|static
     */
    public static function findByUsername($username = null)
    {
        return self::findOne(['username' => $username]);
    }

    public function validatePassword($password)
    {
        return $this->password === $password;
    }

    public static function findIdentity($id)
    {
        // TODO: Implement findIdentity() method.
        return self::findOne($id);
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        // TODO: Implement findIdentityByAccessToken() method.
        return self::findOne(['access_token' => $token]);
    }

    public function getId()
    {
        // TODO: Implement getId() method.
        return $this->id;
    }

    public function getAuthKey()
    {
        // TODO: Implement getAuthKey() method.
        return $this->auth_key;
    }

    public function validateAuthKey($authKey)
    {
        // TODO: Implement validateAuthKey() method.
    }

    /**
     * 生成随机的token并加上时间戳
     * Generated random accessToken with timestamp
     * @throws \yii\base\Exception
     */
    public function generateAccessToken()
    {
        $this->access_token = Yii::$app->security->generateRandomString() . '-' . time();
    }

    /**
     * 验证token是否过期
     * Validates if accessToken expired
     * @param null $token
     * @return bool
     */
    public static function validateAccessToken($token = null)
    {
        if ($token === null) {
            return false;
        } else {
            $timestamp = (int)substr($token, strrpos($token, '-') + 1);
            $expire = Yii::$app->params['user.apiTokenExpire'];
            return $timestamp + $expire >= time();
        }
    }
}
