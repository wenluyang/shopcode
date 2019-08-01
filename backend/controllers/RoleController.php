<?php


namespace backend\controllers;


class RoleController extends BaseController
{
    public function actionIndex(){
        return $this->render("index");
    }
}