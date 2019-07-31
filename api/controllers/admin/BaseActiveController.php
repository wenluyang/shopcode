<?php


namespace api\controllers\admin;


use common\models\Admin;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\ContentNegotiator;
use yii\rest\ActiveController;
use yii\web\Response;

class BaseActiveController extends ActiveController
{
    public $modelClass = 'common\models\Admin';

    public $post;
    public $get;
    public $_user;
    public $_userId;

    /**
     * 自定义一些常用方法
     */
    public function post($key, $default = "")
    {
        return \Yii::$app->request->post($key, $default);
    }


    public function get($key, $default = "")
    {
        return \Yii::$app->request->get($key, $default);
    }

    protected function renderJSON($data = [], $msg = "ok", $code = 200)
    {
        header('Content-type: application/json; charset=utf-8');
        echo json_encode([
            "code" => $code,
            "msg" => $msg,
            "data" => $data,
            "req_id" => uniqid()
        ]);

        return \Yii::$app->end();
    }

    /**
     * @throws \yii\base\InvalidConfigException
     */
    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        $this->_user = Admin::findIdentityByAccessToken(\Yii::$app->request->headers->get('Authorization'));
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors(); // TODO: Change the autogenerated stub
        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::className(),
            'optional' => ['login']
        ];

        $behaviors['contentNegotiator'] = [
            'class' => ContentNegotiator::className(),
            'formats' => [
                'application/json' => Response::FORMAT_JSON
            ]
        ];

//        $behaviors['corsFilter'] = [
//            'class' => \yii\filters\Cors::className(),
//            'cors' => [
//                'Origin' => ['*'],
//                'Access-Control-Request-Headers' => ['authorization'],
//            ]
//        ];

        $behaviors['corsFilter'] = [
            'class' => '\yii\filters\Cors',
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
            ],
        ];


        return $behaviors;
    }

    /**
     * @param $action
     * @return bool
     * @throws \yii\web\BadRequestHttpException
     */
    public function beforeAction($action)
    {
        parent::beforeAction($action); // TODO: Change the autogenerated stub
        $this->post = \Yii::$app->request->post();
        $this->get = \Yii::$app->request->get();
        $this->_user = \Yii::$app->user->identity;
        $this->_userId = \Yii::$app->user->id;
        return $action;
    }

}