<?php


namespace api\controllers\admin;


use common\models\Admin;
use common\models\AdminLoginForm;
use common\models\AdminRole;
use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\helpers\ArrayHelper;
use yii\rest\ActiveController;

class AdminController extends BaseActiveController
{
    public $modelClass = "common\models\Admin";


    /**
     * 登陆接口
     * @return array
     */
    public function actionLogin()
    {
        if (Yii::$app->request->isPost) {
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
                'message' => "用户名或密码错误",
            ];
        }

    }


    /**
     * 添加管理员接口
     */
    public function actionAdd()
    {
        if (Yii::$app->request->isPost) {
            $username = $this->post("username");
            $password = $this->post("password");
            $phone = $this->post("phone", null);
            $email = $this->post("email", null);
            $rolename = $this->post("rolename", null);
            $roleid = $this->post("roleid", 0);
            //判断是否有重名
            $is_exist = Admin::findByUsername($username);
            if ($is_exist) {
                return ["code" => 500, "msg" => "用户名已经存在，请更换一个"];
            }
            $admin = new Admin();
            $admin->username = $username;
            $admin->password = md5($password);
            $admin->phone = $phone;
            $admin->rolename = $rolename;
            $admin->roleid = $roleid;
            $admin->email = $email;
            $admin->save();
            //存入数据的ID
            $id = $admin->id;
            //将用户ID与角色ID 存入到角色-用户关联表中
            $model = new AdminRole();
            $model->uid = $id; //用户ID
            $model->role_id = $roleid; //角色ID
            $model->created_time = date("Y-m-d h:i:s", time()); // 创建时间
            $model->save();
            return ["code" => 200];
        }


    }

    /**
     * 修改管理员
     */
    public function actionEdit()
    {
        if (Yii::$app->request->isPost) {
            $id = $this->post("id");
            $password = $this->post("password");
            $phone = $this->post("phone", null);
            $email = $this->post("email", null);
            $admin = Admin::findIdentity($id);
            if ($password) {
                $admin->password = $password;
            }
            $admin->phone = $phone;
            $admin->email = $email;
            $admin->update();
            return ["code"=>200,"msg"=>"管理员更新成功"];
        }

    }


    /**
     * @param $id
     * 批量删除管理员
     */
    public function actionRemove()
    {
        if (Yii::$app->request->isPost) {
            $ids_str = Yii::$app->request->post();
            //系统设置了超级管理员admin的ID为1 所有要把数组的1去掉
            $ids_str=Admin::deleteByValueToArray($ids_str,1);
            if (!empty($ids_str)) {
                $condition_admin = ['in', 'id', $ids_str];
                Admin::deleteAll($condition_admin);
                //删除角色-用户关联表里的数据
                $condition_admin_role = ['in', 'uid', $ids_str];
                AdminRole::deleteAll($condition_admin_role);
                return ["code" => 200];
            }
            return ["code" => 500];

        }
    }

    /**
     * 获取管理员列表
     * @return array
     */
    public function actionList()
    {
        if (Yii::$app->request->isPost) {
            $username = $this->post("username");
            $pageNo = $this->post("pageNo", 1);
            $pageSize = $this->post("pageSize", 10);
            $offset = ($pageNo - 1) * $pageSize;
            if ($username) {
                $datas = Admin::find()->orderBy(['id' => SORT_ASC])->where(['like', 'username', '%' . $username . '%', false])->with("role");
            } else {
                $datas = Admin::find()->orderBy(['id' => SORT_ASC])->with("role");
            }
            $totalCount = $datas->count();
            $datas = $datas->offset($offset)->limit($pageSize)->asArray()->all();
            return ['data' => ['records' => $datas, 'pageNo' => $pageNo, 'pageSize' => $pageSize, 'totalCount' => $totalCount, 'code' => 'OK']];

        }
    }

    /**
     * 更新前的数据反显
     * @return array
     */
    public function actionGetone(){
        if (Yii::$app->request->isGet) {
            $id=$this->get("id");
            $data=Admin::findOne($id);
            return ["code"=>200,"data"=>$data];
        }
        return ["code"=>500];
    }
}