<?php


namespace backend\controllers;



class AdminController extends BaseController
{
    public function actionIndex(){
        return $this->render("index");
    }
}