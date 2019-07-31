<?php


namespace api\controllers\admin;


use common\models\Admin;
use common\models\AdminLoginForm;
use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\helpers\ArrayHelper;
use yii\rest\ActiveController;

class AdminController extends BaseActiveController
{
    public $modelClass="common\models\Admin";


    /**
     * 登陆接口
     * @return array
     */
    public function actionLogin() {
        if(Yii::$app->request->isPost){
            $model = new AdminLoginForm();
            $model->setAttributes($this->post);
            if ($model->login()) {
                return [
                    'code' => 200,
                    'message' => '登陆成功',
                    'data' => [
                        'access_token' => $model->user->access_token
                    ]
                ];
            }
            return [
                'code' => 500,
                'message' => $model->errors
            ];
        }

    }


    /**
     * 添加管理员接口
     */
    public function  actionAdd(){
        $username = $this->post("username");
        $password= $this->post("password");
        $phone= $this->post("phone",null);
        $email= $this->post("email",null);

        if(!$username || !$password){
           return $this->renderJSON(null,"用户名与密码不能为空",500);
        }

        //判断是否有重名
        $is_exist= Admin::findByUsername($username);
        if($is_exist){
            return $this->renderJSON(null,"用户名已经存在，请更换一个",500);
        }

        $admin = new Admin();
        $admin->username=$username;
        $admin->password=md5($password);
        $admin->phone=$phone;
        $admin->email=$email;

        $admin->save();
        return $this->renderJSON(null,"管理员添加成功",200);

    }

    /**
     * 修改管理员
     */
    public function  actionEdit(){
        $id= $this->post("id");
        $password= $this->post("password");
        $phone= $this->post("phone",null);
        $email= $this->post("email",null);

        $admin = Admin::findIdentity($id);
        if($password){
            $admin->password=md5($password);
        }
        $admin->phone=$phone;
        $admin->email=$email;
        $admin->update();
        return $this->renderJSON(null,"管理员更新成功",200);
    }


    /**
     * @param $id
     * 批量删除管理员
     */
    public function actionDelete($id){
        Admin::deleteAll($id);
    }
}