<?php


namespace api\controllers\admin;


use common\models\Role;

class RoleController extends BaseActiveController
{
    public $modelClass = "common\models\Role";

    /**
     * 添加角色
     */
    public function actionAdd()
    {
        if (\Yii::$app->request->isPost) {
            $model = new Role();
            $name = $this->post("name");
            $model->name = $name;
            $model->created_time = date("Y-m-d h:i:s", time());
            $model->save();
            return ['code' => 200];
        }


    }


    /**
     * 编辑角色
     */
    public function actionEdit()
    {
        if (\Yii::$app->request->isPost) {
            $name = $this->post("name");
            $id = $this->post("id");

            $role = Role::findOne($id);
            $role->name = $name;
            $role->updated_time = date("Y-m-d h:i:s", time());
            $role->update();
            return ['code' => 200];
        }
    }


    /**
     * 获取角色列表
     * @return array
     */
    public function actionList()
    {
        if (\Yii::$app->request->isPost) {
            $username = $this->post("name");
            $pageNo = $this->post("pageNo", 1);
            $pageSize = $this->post("pageSize", 10);
            $offset = ($pageNo - 1) * $pageSize;
            if ($username) {
                $datas = Role::find()->orderBy(['id'=>SORT_ASC])->where(['like', 'name', '%' . $username . '%', false]);
            } else {
                $datas = Role::find()->orderBy(['id'=>SORT_ASC]);
            }
            $totalCount = $datas->count();
            $datas = $datas->offset($offset)->limit($pageSize)->asArray()->all();
            return ['data' => ['records' => $datas, 'pageNo' => $pageNo, 'pageSize' => $pageSize, 'totalCount' => $totalCount, 'code' => 'OK']];

        }
    }


    /**
     * 根据ID获取数据
     * @return array
     */
    public function actionGetone()
    {
        $id = $this->get("id");
        return ['code' => 200, 'data' => Role::findOne($id)];
    }


    /**
     * 用于下拉菜单选项
     * @return array
     */
    public function  actionGetselectlist(){
      if(\Yii::$app->request->isGet){
          $roles = Role::find()->asArray()->all();
          return ["code"=>200,"data"=>$roles];
      }
    }


}