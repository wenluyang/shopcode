<?php


namespace backend\controllers;


use yii\web\Controller;

class MainController extends Controller
{
    public function actionIndex(){
        $this->layout=false;
        return $this->render("index");
    }
}