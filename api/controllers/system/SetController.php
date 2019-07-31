<?php


namespace api\controllers\system;


use yii\filters\auth\HttpBearerAuth;
use yii\helpers\ArrayHelper;
use yii\web\Controller;

class SetController extends Controller
{
    public function behaviors()
    {
        return array_merge(parent::behaviors(), [
            'corsFilter'  => [
                'class' => \yii\filters\Cors::className(),
                'cors'  => [
                    'Origin' => ['*'],
                    'Access-Control-Request-Headers' => ['authorization'],
                ],
            ],
            // ...
        ]);
    }

    public function actionIndex(){
        header('Content-type: application/json; charset=utf-8');
        echo json_encode([
            "code" => "0000",
        ]);

        return \Yii::$app->end();
    }
}