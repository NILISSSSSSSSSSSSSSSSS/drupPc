<template>
    <div class="searchTable">
    <div class="clear">
       <el-button type="text" icon="el-icon-arrow-left" @click="backBtn" size="medium" class="btnBack">返回</el-button>
       <div v-show="showTypeInBtn" class="typeIn"><el-button type="primary" icon="el-icon-edit" @click="typeIn" size="small">录入</el-button></div>
    </div>
    <div class="detailWrapper">
    <el-row>
    <el-col :span="22" :push="1">
    <el-collapse v-model="activeName" accordion>
    <!--基本情况-->
    <el-collapse-item title="基本情况" name="1">
    <div class="infoTable">
        <table class="tg" border="0" cellspacing="0" cellpadding="0">
        <tr>
        <th class="tHeader">姓名</th>
        <th>{{BaseInfomation.Name}}</th>
        <th class="tHeader">身份证号码</th>
        <th>{{BaseInfomation.Card_Id}}</th>
        <th class="tHeader">曾用名/别名</th>
        <th>{{BaseInfomation.OldName}}</th>
        <th colspan="2" rowspan="3" style="border-right:0;">
            <!-- <img src="../../images/pic.jpg" width="120"> -->
            <span v-show="showHeadImg">
                <img :src="BaseInfomation.HeadImageUrl" v-cosauth  @click="viewHeadImg()" width="120" height="120" class="headImg"/>
            </span>
        </th>
        </tr>
        <tr>
        <td class="tHeader">性别</td>
        <td>{{BaseInfomation.Sex}}</td>
        <td class="tHeader">民族</td>
        <td>{{BaseInfomation.Ethnicity}}</td>
        <td class="tHeader">户籍地址</td>
        <td>{{BaseInfomation.PermanentAddress}}</td>
        </tr>
        <tr>
        <td class="tHeader">文化程度</td>
        <td>{{BaseInfomation.Culture}}</td>
        <td class="tHeader">职业</td>
        <td>{{BaseInfomation.Occupation}}</td>
        <td class="tHeader">联系方式</td>
        <td>{{BaseInfomation.PhoneNumber}}</td>
        </tr>
        </table>
    </div>
    </el-collapse-item>
   <!--  戒毒康复情况 -->
    <el-collapse-item title="戒毒康复情况" name="2">
        <div class="RehabilitationInfo">
       <!--  <el-table :data="RehabilitationInfo" style="width: 100%">
            <el-table-column label="执行地区">
                <template slot-scope="scope">
                    <span>{{ scope.row.treatArea}}</span>
                </template>
            </el-table-column>
            <el-table-column label="决定单位">
                <template slot-scope="scope">
                    <span>{{ scope.row.DeterminingUnit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="报到日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.ReportDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.RehabilitativeEndDate}}</span>
                </template>
            </el-table-column>
                <el-table-column label="法律文书编号">
                <template slot-scope="scope">
                    <span>{{ scope.row.RehabilitativeEndDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="戒毒康复期间是否参加药维持治疗">
                <template slot-scope="scope">
                    <span>{{ scope.row.medicineTreat}}</span>
                </template>
            </el-table-column>
            <el-table-column label="康复期间是否进入康复场所">
                <template slot-scope="scope">
                    <span>{{ scope.row.recoveryPlace}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束原因">
                <template slot-scope="scope">
                    <span>{{ scope.row.endReason}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束后的接收单位">
                <template slot-scope="scope">
                    <span>{{ scope.row.receiveUnit}}</span>
                </template>
            </el-table-column>
        </el-table> -->
        <table border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                <th>报到时间</th>
                <th>结束时间</th>
                <th>决定单位</th>
                <th>法律文书编号</th>
                <th>决定书照片</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{RehabilitationInfo.ReportDate}}</td>
                    <td>{{RehabilitationInfo.RehabilitativeEndDate}}</td>
                    <td>{{RehabilitationInfo.DeterminingUnit}}</td>
                    <td>{{RehabilitationInfo.LawBookNumber}}</td>
                    <!-- <td>{{RehabilitationInfo.RehabilitationPhoto}}</td> -->
                    <td>
                        <div class="imgs">
                          <img :src="item" v-for="(item,index) in RehabilitationInfo.RehabilitationPhoto" v-cosauth :key="item" @click="viewPhoto(index,4)"/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </el-collapse-item>
    <!-- 变更地点信息 -->
    <el-collapse-item title="变更地点信息" name="3">
        <div class="commonDistance">
            <el-table :data="executorSPinfo" style="width: 100%" border>
            <el-table-column label="戒毒类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.Variety_of_drugString}}</span>
                </template>
            </el-table-column>
            <el-table-column label="现执行地">
                <template slot-scope="scope">
                    <span>{{ scope.row.DeterminingUnit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="移交日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接收地">
                <template slot-scope="scope">
                    <span>{{ scope.row.ExecutorAddress}}</span>
                </template>
            </el-table-column>
        </el-table> 
        </div>
    </el-collapse-item>
    <!-- 签到 -->
    <el-collapse-item title="签到" name="4">
    <div class="commonDistance">
        <el-table :data="signinfo" style="width: 100%" border>
            <el-table-column label="签到时间" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="签到地点" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.address}}</span>
                </template>
            </el-table-column>
             <el-table-column label="实时照片">
                <template slot-scope="scope">
                    <!-- <span>{{ scope.row.address}}</span> -->
                    <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.signPhoto" v-cosauth @click="viewImg(scope.$index, scope.row,index,0)" :key="index"/>
                    </div>
                </template>
            </el-table-column>
             <el-table-column label="实时视频">
                <template slot-scope="scope">
                    <!-- <span>{{ scope.row.Video}}</span> -->
                    <video :src="scope.row.Video" controls="controls" width="100%" height="100px"></video>
                </template>
            </el-table-column>
            <el-table-column label="签到地图">
                <template slot-scope="scope">
                    <div>
                        <el-button @click="trackDetail(scope.$index,scope.row)" type="text" size="small">详情</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--签到地图轨迹-->
        <el-dialog title="签到地图" :visible.sync="dialogFormVisible" :append-to-body="true" width="70%">
            <p v-show="showSignInfo" class="signInfo">{{signInfo}}</p>
            <div class="amap-page-container">
                 <div class="amap-page-container">
                    <el-amap vid="amap" :zoom="zoom" :center="center" class="amap-demo">
                          <!-- <el-amap-polyline :editable="polyline.editable"  :path="polyline.path" :events="polyline.events"></el-amap-polyline> -->
                         <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
                    </el-amap>
                </div>
           </div>
        </el-dialog>

    </div>
    </el-collapse-item>
    <!-- 谈话 -->
        <el-collapse-item title="谈话" name="5">
        <div class="commonDistance">
            <el-table :data="talkinfo" style="width: 100%" border>
            <el-table-column label="谈话时间" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.TalkTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="谈话地点" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.TalkPlace}}</span>
                </template>
            </el-table-column>
            <el-table-column label="谈话方式" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.TalkMode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="谈话人员" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.TalkName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="被谈话人员" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.WorkName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="谈话内容照片">
                <template slot-scope="scope">
                    <!-- <img :src="scope.row.TalkPhoto" width="100" height="100" /> -->
                    <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.talkPhotos" v-cosauth @click="viewImg(scope.$index, scope.row,index,0)" :key="index"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </div>
    </el-collapse-item>
    <!-- 尿检 -->
        <el-collapse-item title="尿检" name="6">
            <div class="commonDistance">  
            <el-table :data="Urineinfo" style="width: 100%" border>
            <el-table-column label="尿检时间" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.UrineTestTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="尿检地点" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.UrineTestAddress}}</span>
                </template>
            </el-table-column>
            <el-table-column label="尿检结果" width="80px">
                <template slot-scope="scope">
                    <span>{{ scope.row.UrineTestResults}}</span>
                </template>
            </el-table-column>
            <el-table-column label="尿检人" width="80px">
                <template slot-scope="scope">
                    <span>{{ scope.row.UrineWorkerName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="尿检照片">
            <!-- <el-table-column label="尿检人员照片"> -->
                <template slot-scope="scope">
                    <!-- <img :src="scope.row.UrineTestPhoto" width="100" height="100" /> -->
                    <div class="imgs">
                        <img :src="item" @click="viewImg(scope.$index, scope.row,index,0)" v-cosauth v-for="(item,index) in scope.row.UrinePeople" :key="item" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="现场检测报告单照片">
                <template scope="scope">
                    <!-- <img :src="scope.row.UrineTestPhotoRP" width="100" height="100" /> -->
                    <div class="imgs">
                        <img :src="item"  @click="viewImg(scope.$index, scope.row,index,1)" v-cosauth  v-for="(item,index) in scope.row.UrineReport" :key="item" />
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </div>
    </el-collapse-item>
    <!-- 请假 -->
        <el-collapse-item title="请假" name="7">
        <div class="commonDistance">
            <el-table :data="leaveinfo" style="width: 100%" border>
            <el-table-column label="开始时间" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.StartTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.EndTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="事由" width="50px">
                <template slot-scope="scope">
                    <span>{{ scope.row.Reason}}</span>
                </template>
            </el-table-column>
            <el-table-column label="目的地" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.Destination}}</span>
                </template>
            </el-table-column>
            <el-table-column label="批准人" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.WorkerName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请假条照片">
                <template slot-scope="scope">
                    <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.leaveInfoPhoto" v-cosauth @click="viewImg(scope.$index, scope.row,index,0)" :key="item" />
                    </div>
                   <!--  <div v-show="leaveImg">
                       <img :src="scope.row.Photo" width="100" height="100" />
                    </div> -->
                </template>
            </el-table-column>
        </el-table>
        </div>
    </el-collapse-item>
    <!-- 变更执行地 -->
        <el-collapse-item title="变更执行地" name="8">
        <div class="commonDistance">
            <el-table :data="executorres" style="width: 100%" border>
            <el-table-column label="变更原因" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.Reason}}</span>
                </template>
            </el-table-column>
            <el-table-column label="变更日期" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.ChangeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="执行地" width="180px">
                <template slot-scope="scope">
                    <span>{{ scope.row.ExecutorAddress}}</span>
                </template>
            </el-table-column>
            <el-table-column label="委托书照片">
                <template slot-scope="scope">
                    <!-- <img :src="scope.row.Photo" width="100" height="100" /> -->
                     <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.approvePhoto" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,0)"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </div>
    </el-collapse-item>
      <!-- 综合评估 -->
        <el-collapse-item title="综合评估" name="9">
        <div class="commonDistance">
            <el-table :data="comprehensiveinfo" style="width: 100%" border>
            <el-table-column label="开始时间" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.ComprehensiveStartTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.ComprehensiveEndTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="评估表照片">
                <template slot-scope="scope">
                    <!-- <img :src="scope.row.ComprehensiveTPhoto" width="100" height="100" /> -->
                    <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.comprehensivePhoto" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,0)"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </div>
    </el-collapse-item>
    <!-- 违反协议 -->
        <el-collapse-item title="违反协议" name="10">
        <div class="commonDistance">
            <!-- <img src="../../images/lawFile.jpg" width="556" height="800"> -->
            <!-- <ul class="breakProtocol">
                <li v-for="(item,index) in manualentryinfo" :key="index">
                    <img :src="item.photo" width="500" height="500" />
                </li>
            </ul> -->
           <!--  <div class="imgs">
                <img :src="item" v-for="(item,index) in manualentryinfo.manualentryinfoPhoto" :key="item" @click="viewPhoto(index,3)"/>
            </div> -->
            <h2 class="finishHeader">逃避、拒绝接收检测</h2>
            <el-table :data="Refusalcheck" border style="width: 100%">
                <el-table-column label="拒检次数" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.RefusalcheckLevel}}</span>
                  </template>
                </el-table-column>
                <el-table-column  prop="name" label="当前日期" width="120">
                 <template slot-scope="scope">
                    <span>{{ scope.row.Refusalcheck_NowTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="通知尿检日期" width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.Refusalcheck_UrineTestTime}}</span>
                  </template>
                </el-table-column>
                 <el-table-column prop="address" label="违法/违规行为报告照片">
                     <template slot-scope="scope">
                      <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.RefusalcheckPhoto1" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,0)"/>
                     </div>
                    </template>
                </el-table-column>
                 <el-table-column prop="address" label="告诫书照片">
                 <template slot-scope="scope">
                   <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.RefusalcheckPhoto2" :key="item" v-cosauth @click="viewImg(scope.$index, scope.row,index,1)"/>
                    </div>
                  </template>
                </el-table-column>
             </el-table>
            <h2 class="finishHeader">擅自离开执行地</h2>
             <el-table :data="LeaveExecutor" border style="width: 100%">
                <el-table-column label="离开次数" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.LeaveExecutorLevel}}</span>
                  </template>
                </el-table-column>
                <el-table-column  prop="name" label="当前日期" width="120">
                 <template slot-scope="scope">
                    <span>{{ scope.row.LeaveExecutor_NowTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column  prop="name" label="离开日期" width="120">
                 <template slot-scope="scope">
                    <span>{{ scope.row.LeaveExecutor_LeaveExecutorData}}</span>
                  </template>
                </el-table-column>
                 <el-table-column prop="address" label="离开天数" width="100">
                     <template slot-scope="scope">
                      <span>{{scope.row.LeaveExecutor_Days}}</span>
                    </template>
                </el-table-column>
                 <el-table-column prop="address" label="违法/违规行为报告照片">
                 <template slot-scope="scope">
                   <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.LeaveExecutorPhoto" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,0)"/>
                    </div>
                  </template>
                </el-table-column>
             </el-table>
            <h2 class="finishHeader">通讯地址/联系电话变更未报到</h2>
             <el-table :data="AddressChangeReport" border style="width: 100%">
                <el-table-column  prop="name" label="当前日期" width="120">
                 <template slot-scope="scope">
                    <span>{{ scope.row.AddressChangeReport_NowTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="发现日期" width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.AddressChangeReport_FindDate}}</span>
                  </template>
                </el-table-column>
                 <el-table-column prop="address" label="证明照片">
                     <template slot-scope="scope">
                      <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.ChangeReportPhoto1" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,0)"/>
                     </div>
                    </template>
                </el-table-column>
                 <el-table-column prop="address" label="严重违反协议通知照片">
                 <template slot-scope="scope">
                   <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.ChangeReportPhoto2" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,1)"/>
                    </div>
                  </template>
                </el-table-column>
             </el-table>
            <h2 class="finishHeader">联系电话非本人使用或无法联系</h2>
            <el-table :data="TelephoneNoContact" border style="width: 100%">
                <el-table-column  prop="name" label="当前日期" width="120">
                 <template slot-scope="scope">
                    <span>{{ scope.row.TelephoneNoContact_NowTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="发现日期" width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.TelephoneNoContact_FindDate}}</span>
                  </template>
                </el-table-column>
                 <el-table-column prop="address" label="证明照片">
                     <template slot-scope="scope">
                      <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.TelephoneNoContactPhoto1" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,0)"/>
                     </div>
                    </template>
                </el-table-column>
                 <el-table-column prop="address" label="严重违反协议通知照片">
                 <template slot-scope="scope">
                   <div class="imgs">
                        <img :src="item" v-for="(item,index) in scope.row.TelephoneNoContactPhoto2" v-cosauth :key="item" @click="viewImg(scope.$index, scope.row,index,1)"/>
                    </div>
                  </template>
                </el-table-column>
             </el-table>
        </div>
    </el-collapse-item>
    <!-- 期满/终止/中止 -->
        <el-collapse-item title="期满/终止/中止" name="11">
        <div>
            <h2 class="finishHeader">解除社区戒毒</h2>
            <div class="finishTable">
            <!-- <el-table :data="finishTable" style="width: 100%" >
            <el-table-column label="初次查获时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.discoverTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="纳入戒毒时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.drugTreatTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="三年戒毒期间是否有违法行为">
                <template slot-scope="scope">
                    <span>{{ scope.row.unlawfulAct}}</span>
                </template>
            </el-table-column>
        </el-table> -->
        <table border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                <th>起始日期</th>
                <th>终止日期</th>
                <th>解除审批照片</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{RelieveDrug.RelieveBeginDate}}</td>
                    <td>{{RelieveDrug.RelieveDrugDate}}</td>
                    <td>
                        <!-- <img :src="RelieveDrug.ExaminePhotoupload" width="100%"/> -->
                        <div class="imgs">
                          <img :src="item" v-for="(item,index) in RelieveDrug.RelieveDrugPhoto" v-cosauth @click="viewPhoto(index,0)" :key="item"/>
                       </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
        <!--终止-->
        <h2 class="finishHeader">终止社区戒毒</h2>
        <!-- <p class="endDeclare">戒毒康复人员<b>张三</b>，于<b>2017</b>年<b>01</b>月<b>22</b>日被责令接受社区戒毒/社区康复（决定书文号<b>0269954411458</b>），因被（依法收监执行刑罚、采取
            强制性教育措施）的原因，故该戒毒康复人员的社区戒毒/社区康复程序终止。</p>
        <p class="endDeclare">
            特此说明。
        </p>
        <div class="workStationInfo">
            <p>
                <b>披砂镇</b>社区戒毒社区戒毒（康复）工作站
            </p>
            <p>
                <b>2017</b>年<b>01</b>月<b>22</b>日
            </p>
        </div> -->
        <div class="finishTable">
            <table border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                <th>起始日期</th>
                <th>终止日期</th>
                <th>终止原因</th>
                <th>终止说明图片照片</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{OverDrug.OverBeginDate}}</td>
                    <td>{{OverDrug.OverDate}}</td>
                    <td>{{OverDrug.OverReason}}</td>
                    <td>
                        <!-- <img :src="OverDrug.OverReasonPhoto" width="100%"/> -->
                         <div class="imgs">
                          <img :src="item" v-for="(item,index) in OverDrug.OverDrugPhoto" v-cosauth :key="item" @click="viewPhoto(index,2)" />
                       </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
        <!--中止-->
        <h2 class="finishHeader">中止社区戒毒</h2>
        <!--  <p class="endDeclare">戒毒康复人员<b>李四</b>，于<b>2018</b>年<b>02</b>月<b>13</b>日被责令接受社区戒毒/社区康复（决定书文号<b>0269954411458</b>），因被（依法拘留、逮捕）
            的原因，故该戒毒康复人员的社区戒毒/社区康复程序中止。</p>
        <p class="endDeclare">
            特此说明。
        </p>
        <div class="workStationInfo">
            <p>
                <b>披砂镇</b>社区戒毒社区戒毒（康复）工作站
            </p>
            <p>
                <b>2017</b>年<b>02</b>月<b>13</b>日
            </p>
        </div> -->
        <div class="finishTable">
            <table border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                <th>起始日期</th>
                <th>终止日期</th>
                <th>中止原因</th>
                <th>中止说明图片照片</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{StopDrug.StopBeginDate}}</td>
                    <td>{{StopDrug.StopDate}}</td>
                    <td>{{StopDrug.StopReason}}</td>
                    <td>
                        <!-- <img :src="StopDrug.StopReasonPhoto" width="100%"/> -->
                        <div class="imgs">
                          <img :src="item" v-for="(item,index) in StopDrug.StopDrugPhoto" v-cosauth :key="item" @click="viewPhoto(index,1)"/>
                       </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
        </div>
    </el-collapse-item>
        <div class="commonDistance">
        <el-collapse-item title="救助帮扶" name="12">
             <el-table :data="helpinfo"  border style="width: 100%">
                <el-table-column prop="HelpObject" label="被帮扶人" width="150px">
                </el-table-column>
                <el-table-column prop="HelpPeaple" label="帮扶人" width="150px">
                </el-table-column>
                <el-table-column prop="PushTime" label="帮扶时间" width="150px">
                </el-table-column>
                <!--  <el-table-column prop="PhoneNumber" label="联系方式">
                </el-table-column> -->
                 <el-table-column prop="Discrible" label="帮扶内容">
                </el-table-column>
            </el-table>
        </el-collapse-item>
        </div>
    </el-collapse>
    </el-col>
    </el-row>
    </div>
    <!--预览图片-->
    <el-dialog :visible.sync="viewImgVisible" :append-to-body="true" width="50%">
      <img :src="showImg" width="100%" height="500px" v-cosauth>
    </el-dialog>
    </div>
</template>

<script>
   import Cookies from 'js-cookie';
   export default {
       name:'detail',
       data(){
           return{
               viewImgVisible:false,
               signInfo:"",
                showSignInfo:false,
                selectIndex: undefined,
                showTypeInBtn:false,
                token:"",
                showImg:null,
                leaveImg:false,
                leaveImgs:false,
                myPhoneNum:'',
                zoom: 12,
                showHeadImg:true,
                drugerId:'',
                BaseInfomation:{},
                RehabilitationInfo:{},
                RelieveDrug:{},
                OverDrug:{},
                StopDrug:{},
                executorSPinfo:[],
                executorres:[],
                talkinfo:[],
                leaveInfoPhoto:[],
                Urineinfo:[],
                leaveinfo:[],
                comprehensiveinfo:[],
                manualentryinfo:[],
                signinfo:[],
                helpinfo:[],
                Refusalcheck:[],
                LeaveExecutor:[],
                AddressChangeReport:[],
                TelephoneNoContact:[],
                Jurisdiction:"",
                slotStyle: {
                    padding: '2px 8px',
                    background: '#eee',
                    color: '#333',
                    border: '1px solid #aaa'
                },
                /* polyline: {
                    path: [[102.302242,27.991719], [102.215286,27.966198], [102.265735,27.948457]],
                    events: {
                    click(e) {
                        alert('click polyline');
                    },
                    end: (e) => {
                        let newPath = e.target.getPath().map(point => [point.lng, point.lat]);
                        console.log(newPath);
                    }
                    },
                    editable: false
                }, */
                // center: [121.5273285, 31.21515044],
                center:[],
                markers: [
                    {
                    position: [121.5273285, 31.21515044],
                    position:[],
                    visible: true,
                    draggable: false,
                    template: '<span>1</span>',
                   }
                ],
                dialogFormVisible:false,
                activeName: '1',
                finishTable: [{
                    discoverTime: '2014-03-18',
                    drugTreatTime: '2015-01-01',
                    unlawfulAct: '否'
                }, {
                    discoverTime: '2014-03-18',
                    drugTreatTime: '2015-01-01',
                    unlawfulAct: '否'
                }, {
                    discoverTime: '2014-03-18',
                    drugTreatTime: '2015-01-01',
                    unlawfulAct: '否'
                }],
                signTable: [{
                    signTime: '2018-03-18',
                    signPlace: '西昌市'
                }, {
                    signTime: '2018-03-19',
                    signPlace: '德昌县'
                }, {
                    signTime: '2018-03-18',
                    signPlace: '盐源县'
                }],
                State:null
           }
       },
       created(){
          //获取token
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            //获取吸毒人员的身份证号码
            this.drugerId = this.$route.query.drugerId;
            //获取当前登录者权限
            this.Jurisdiction = Cookies.get('Jurisdiction');
            if(this.Jurisdiction == 3){
                this.showTypeInBtn =  true;
            }else{
                this.showTypeInBtn = false;
            }
            //进入页面加载数据
            this.showDetail({
                ToKen:this.token,
                PhoneNumber:this.myPhoneNum,
                Card_Id:this.drugerId
            });
       },
       mounted(){
          this.loadmap();     //加载地图和相关组件
       },
       methods:{
           //格式化时间
           formatTime: function(UTC_time) {
             if(UTC_time){
                 var date1 = new Date(UTC_time);
                 return date1.toLocaleDateString();
             }else{
                 return "";
             }
            },
            timeFormat:function(ms){
                var date = new Date(ms);
                var hour,min,second,yearM;
                hour = date.getHours();
                min = date.getMinutes();
                second = date.getSeconds();
                yearM = date.toLocaleDateString();
                hour < 10 ? (hour = '0' + hour) : hour;
                min < 10 ? (min = '0' + min) : min;
                second < 10 ? (second = '0' + second) : second;
                return `${yearM} ${hour}:${min}:${second}`;
            },
            //放大头像
            viewHeadImg:function(){
                console.log('头像');
                if(this.BaseInfomation.HeadImageUrl){
                    this.viewImgVisible = true;
                    this.showImg = this.BaseInfomation.HeadImageUrl;
                }
            },
            //放大图片
           viewImg:function(index,row,imgIndex,type){
              this.viewImgVisible = true;
              if(row.UrineReport && type==1){
                  //尿检报告单照片
                  this.showImg = row.UrineReport[imgIndex];
              }else if(row.UrinePeople && type==0){
                  //尿检人员照片
                  this.showImg = row.UrinePeople[imgIndex];
              }else if(row.talkPhotos && type==0){
                  //谈话内容图片
                  this.showImg = row.talkPhotos[imgIndex];
              }else if(row.leaveInfoPhoto && type==0){
                  //请假条照片
                  this.showImg = row.leaveInfoPhoto[imgIndex];
              }else if(row.approvePhoto && type==0){
                  //变更执行地审批表照片
                  this.showImg = row.approvePhoto[imgIndex];
              }else if(row.comprehensivePhoto && type==0){
                  //综合评估表照片
                  this.showImg = row.comprehensivePhoto[imgIndex];
              }else if(row.signPhoto && type==0){
                  //签到人员照片
                  this.showImg = row.signPhoto[imgIndex];
              }else if(row.RefusalcheckPhoto1 && type ==0){
                  //逃避、拒绝接收检测——拒绝接收检测违法违规行为照片
                  this.showImg = row.RefusalcheckPhoto1[imgIndex];
              }else if(row.RefusalcheckPhoto2 && type ==1){
                  //逃避、拒绝接收检测——告诫书照片
                  this.showImg = row.RefusalcheckPhoto2[imgIndex];
              }else if(row.LeaveExecutorPhoto && type == 0){
                  //擅自离开执行地违法违规照片
                  this.showImg = row.LeaveExecutorPhoto[imgIndex];
              }else if(row.ChangeReportPhoto1 && type == 0){
                  //通讯地址/联系电话变更未报到 —— 证明照片
                  this.showImg = row.ChangeReportPhoto1[imgIndex];
              }else if(row.ChangeReportPhoto2 && type == 1){
                  //通讯地址/联系电话变更未报到 —— 严重违法违规照片
                  this.showImg = row.ChangeReportPhoto2[imgIndex];
              }else if(row.TelephoneNoContactPhoto1 && type == 0){
                  //电话非本人使用或者无法联系 —— 证明照片
                  this.showImg = row.TelephoneNoContactPhoto1[imgIndex];
              }else if(row.TelephoneNoContactPhoto2 && type == 1){
                  //电话非本人使用或者无法联系 —— 严重违反协议照片
                  this.showImg = row.TelephoneNoContactPhoto2[imgIndex];
              }
           },
           //放大期满中止终止图片
           viewPhoto:function(index,type){
               this.viewImgVisible = true;
               if(type == 0){
                   //期满解除审批照片
                  this.showImg = this.RelieveDrug.RelieveDrugPhoto[index];
               }else if(type == 1){
                   //中止说明照片
                  this.showImg = this.StopDrug.StopDrugPhoto[index];
               }else if(type == 2){
                   //终止说明照片
                    this.showImg = this.OverDrug.OverDrugPhoto[index]; 
               }else if(type == 3){
                   //违反协议照片
                   this.showImg = this.manualentryinfo.manualentryinfoPhoto[index];
               }else if(type == 4){
                   //决定书照片
                   this.showImg = this.RehabilitationInfo.RehabilitationPhoto[index];
               }
           },
           //返回按钮
           backBtn:function(){
            //    this.$router.push({path:'/personManage/drugRecovery'});
            this.$router.go(-1);
           },
           //录入
           typeIn:function(){
            //   this.$router.push({path:'/typeIn',query:{drugerId:this.$route.query.drugerId}});
            // this.Tool.state = this.$route.query.drugerState;
            console.log(this.Tool.state);
            if(this.Tool.state == 1){
             //没有人员核实，进入人员核实页面
               this.$router.push({
                    path: '/personManage/personClaim',
                    query:{
                        chooseState:"first",
                        drugerId:this.drugerId
                    }
                }); 
            }else if(this.Tool.state == 2){
                //没有录入详情，进入报到登记页面
                this.$router.push({
                    path: '/personManage/personClaim',
                    query:{
                        chooseState:"second",
                        drugerId:this.drugerId
                    }
                });
            }else if(this.Tool.state == 3){
                //进入录入页面
                 this.$router.push({
                    path: '/typeIn',
                    query:{
                        drugerId:this.drugerId,
                        name:this.BaseInfomation.Name
                    }
                });
            }
           },
           //地图轨迹详情
           trackDetail:function(index,row){
               console.log(index,row);
               this.dialogFormVisible = true;
               this.center = [];
               if(row.longtitude && row.lattitude){
                   this.showSignInfo = false;
                   this.center=[row.longtitude,row.lattitude];
                   this.markers[0].position = [row.longtitude,row.lattitude];
                 if(row.longtitude == "未允许定位" && row.lattitude == "未允许定位"){
                   /* this.center = [0,0];
                   this.markers[0].position = [0,0]; */
                   console.log('未允许定位');
                   this.showSignInfo = true;
                   this.signInfo = "该人员未打开GPS定位系统，无法获取签到轨迹";
                   this.center = [0,0];
                   this.markers[0].position = [0,0];
                }
               }else{
                   this.showSignInfo = true;
                   this.signInfo = "暂无签到数据";
                   this.center = [0,0];
                   this.markers[0].position = [0,0];
               }
           },
           loadmap(){
             
           },
           //进入页面请求数据
           showDetail(obj){
                this.$http
                .get(this.serverIP + "/drugusercomplexdetails/complexdetail", {
                    params:obj
                })
                .then(response => {
                    console.log(response);
                    if (response.data.errno == 0) {
                       //基本情况
                       this.BaseInfomation = response.data.data.BaseInfomation;
                       if(this.BaseInfomation.Sex == 0){
                           this.BaseInfomation.Sex = "";
                       }else if(this.BaseInfomation.Sex == 1){
                           this.BaseInfomation.Sex = "男";
                       }else if(this.BaseInfomation.Sex == 2){
                           this.BaseInfomation.Sex = "女";
                       }
                       //图片
                       if(this.BaseInfomation.HeadImageUrl){
                           this.showHeadImg = true;
                       }else{
                           this.showHeadImg = false;
                       }
                       //变更地点信息
                       this.executorSPinfo = response.data.data.executorSPinfo;  
                        for(var i=0;i<this.executorSPinfo.length;i++){
                            this.executorSPinfo[i].createTime = this.formatTime(this.executorSPinfo[i].createTime);
                        }
                       //变更执行地
                       this.executorres = response.data.data.executorres;
                       for(var e =0;e<this.executorres.length;e++){
                           this.executorres[e].ChangeTime = this.formatTime(this.executorres[e].ChangeTime);
                           //审批表照片
                           this.executorres[e].approvePhoto =[];
                           if(this.executorres[e].Photo){
                               if(this.executorres[e].Photo.indexOf("$@") > -1){
                               this.executorres[e].approvePhoto = this.executorres[e].Photo.split("$@");
                           }else{
                               this.executorres[e].approvePhoto.push(this.executorres[e].Photo);
                           }
                           }
                       }
                       //谈话
                       this.talkinfo = response.data.data.talkinfo;
                       for(var k=0;k<this.talkinfo.length;k++){
                           this.talkinfo[k].TalkTime = this.formatTime(this.talkinfo[k].TalkTime);
                           //谈话图片
                           this.talkinfo[k].talkPhotos=[];
                           if(this.talkinfo[k].TalkPhoto){
                               if(this.talkinfo[k].TalkPhoto.indexOf("$@") > -1){
                               this.talkinfo[k].talkPhotos = this.talkinfo[k].TalkPhoto.split("$@");
                           }else{
                               this.talkinfo[k].talkPhotos.push(this.talkinfo[k].TalkPhoto);
                           }
                           }
                       }
                       //尿检
                       this.Urineinfo = response.data.data.Urineinfo;
                       for(var a=0;a<this.Urineinfo.length;a++){
                           this.Urineinfo[a].UrineTestTime = this.formatTime(this.Urineinfo[a].UrineTestTime);
                           //尿检图片
                           this.Urineinfo[a].UrinePeople = [];
                           this.Urineinfo[a].UrineReport = [];
                           if(this.Urineinfo[a].UrineTestPhoto){
                               if(this.Urineinfo[a].UrineTestPhoto.indexOf("$@") > -1){
                               this.Urineinfo[a].UrinePeople = this.Urineinfo[a].UrineTestPhoto.split("$@");
                                }else{
                                    this.Urineinfo[a].UrinePeople.push(this.Urineinfo[a].UrineTestPhoto);
                                }
                           }
                        
                        if(this.Urineinfo[a].UrineTestPhotoRP){
                             if(this.Urineinfo[a].UrineTestPhotoRP.indexOf("$@") > -1){
                               this.Urineinfo[a].UrineReport = this.Urineinfo[a].UrineTestPhotoRP.split("$@");
                           }else{
                               this.Urineinfo[a].UrineReport.push(this.Urineinfo[a].UrineTestPhotoRP);
                           }
                        }
                       }
                       //请假
                       this.leaveinfo = response.data.data.leaveinfo;
                       for(var b=0;b<this.leaveinfo.length;b++){
                           this.leaveinfo[b].StartTime = this.formatTime(this.leaveinfo[b].StartTime);
                           this.leaveinfo[b].EndTime = this.formatTime(this.leaveinfo[b].EndTime);
                           //请假图片
                           this.leaveinfo[b].leaveInfoPhoto=[];
                           if(this.leaveinfo[b].Photo){
                           if(this.leaveinfo[b].Photo.indexOf("$@") > -1){
                               console.log(this.leaveinfo[b].Photo);
                               this.leaveinfo[b].leaveInfoPhoto = this.leaveinfo[b].Photo.split("$@");
                           }else{
                               this.leaveinfo[b].leaveInfoPhoto.push(this.leaveinfo[b].Photo);
                           }
                          }
                       }

                       //综合评估
                       this.comprehensiveinfo = response.data.data.comprehensiveinfo;
                       for(var c=0;c<this.comprehensiveinfo.length;c++){
                           this.comprehensiveinfo[c].ComprehensiveStartTime = this.formatTime(this.comprehensiveinfo[c].ComprehensiveStartTime);
                           this.comprehensiveinfo[c].ComprehensiveEndTime = this.formatTime(this.comprehensiveinfo[c].ComprehensiveEndTime);
                           this.comprehensiveinfo[c].comprehensivePhoto=[];
                           if(this.comprehensiveinfo[c].ComprehensiveTPhoto.indexOf("$@") > -1){
                               this.comprehensiveinfo[c].comprehensivePhoto = this.comprehensiveinfo[c].ComprehensiveTPhoto.split("$@");
                           }else{
                               this.comprehensiveinfo[c].comprehensivePhoto.push(this.comprehensiveinfo[c].ComprehensiveTPhoto);
                           }
                       }
                       //救助帮扶
                       this.helpinfo = response.data.data.helpinfo;
                       for(var x=0;x<this.helpinfo.length;x++){
                           this.helpinfo[x].PushTime = this.formatTime(this.helpinfo[x].PushTime);
                       }
                       //违反协议
                       //逃避、拒绝接受检测
                       this.Refusalcheck = response.data.data.manualentryinfo.Refusalcheck;
                       if(this.Refusalcheck){
                       for(var m = 0;m<this.Refusalcheck.length;m++){
                           this.Refusalcheck[m].Refusalcheck_NowTime = this.formatTime(this.Refusalcheck[m].Refusalcheck_NowTime);
                           this.Refusalcheck[m].Refusalcheck_UrineTestTime = this.formatTime(this.Refusalcheck[m].Refusalcheck_UrineTestTime);
                           //照片
                           this.Refusalcheck[m].RefusalcheckPhoto1 = [];
                           this.Refusalcheck[m].RefusalcheckPhoto2 = [];
                           if(this.Refusalcheck[m].Refusalcheck_UrineTestNoticePhoto){
                               if(this.Refusalcheck[m].Refusalcheck_UrineTestNoticePhoto.indexOf("$@") > -1){
                               this.Refusalcheck[m].RefusalcheckPhoto1 = this.Refusalcheck[m].Refusalcheck_UrineTestNoticePhoto.split("$@");
                                }else{
                                    this.Refusalcheck[m].RefusalcheckPhoto1.push(this.Refusalcheck[m].Refusalcheck_UrineTestNoticePhoto);
                                }
                           }
                           if(this.Refusalcheck[m].Refusalcheck_OralExhortPhoto){
                                if(this.Refusalcheck[m].Refusalcheck_OralExhortPhoto.indexOf("$@") > -1){
                               this.Refusalcheck[m].RefusalcheckPhoto2 = this.Refusalcheck[m].Refusalcheck_OralExhortPhoto.split("$@");
                           }else{
                               this.Refusalcheck[m].RefusalcheckPhoto2.push(this.Refusalcheck[m].Refusalcheck_OralExhortPhoto);
                           }
                           }
                        }
                       }else{

                       }
                       //擅自离开执行地
                       this.LeaveExecutor = response.data.data.manualentryinfo.LeaveExecutor;
                       for(var n=0;n<this.LeaveExecutor.length;n++){
                           this.LeaveExecutor[n].LeaveExecutor_NowTime = this.formatTime(this.LeaveExecutor[n].LeaveExecutor_NowTime);
                           this.LeaveExecutor[n].LeaveExecutor_LeaveExecutorData = this.formatTime(this.LeaveExecutor[n].LeaveExecutor_LeaveExecutorData);
                           //照片
                           this.LeaveExecutor[n].LeaveExecutorPhoto = [];
                           if(this.LeaveExecutor[n].LeaveExecutor_SeriousViolationViolationPhoto){
                           if(this.LeaveExecutor[n].LeaveExecutor_SeriousViolationViolationPhoto.indexOf("$@") > -1){
                               this.LeaveExecutor[n].LeaveExecutorPhoto = this.LeaveExecutor[n].LeaveExecutor_SeriousViolationViolationPhoto.split("$@");
                           }else{
                               this.LeaveExecutor[n].LeaveExecutorPhoto.push(this.LeaveExecutor[n].LeaveExecutor_SeriousViolationViolationPhoto);
                           }
                           }
                       }
                       //通讯地址/联系电话变更未报到
                       this.AddressChangeReport.push(response.data.data.manualentryinfo.AddressChangeReport);
                       this.AddressChangeReport[0].AddressChangeReport_NowTime = this.formatTime(this.AddressChangeReport[0].AddressChangeReport_NowTime);
                       this.AddressChangeReport[0].AddressChangeReport_FindDate = this.formatTime(this.AddressChangeReport[0].AddressChangeReport_FindDate);
                       this.AddressChangeReport[0].ChangeReportPhoto1 = [];
                       this.AddressChangeReport[0].ChangeReportPhoto2 = [];
                       //照片
                       if(this.AddressChangeReport[0].AddressChangeReport_ProofUploadPhoto){
                        if(this.AddressChangeReport[0].AddressChangeReport_ProofUploadPhoto.indexOf("$@") > -1){
                                this.AddressChangeReport[0].ChangeReportPhoto1 = this.AddressChangeReport[0].AddressChangeReport_ProofUploadPhoto.split("$@");
                            }else{
                                this.AddressChangeReport[0].ChangeReportPhoto1.push(this.AddressChangeReport[0].AddressChangeReport_ProofUploadPhoto);
                        }
                       }

                       if(this.AddressChangeReport[0].AddressChangeReport_SeriousViolationViolationPhoto){
                       if(this.AddressChangeReport[0].AddressChangeReport_SeriousViolationViolationPhoto.indexOf("$@") > -1){
                               this.AddressChangeReport[0].ChangeReportPhoto2 = this.AddressChangeReport[0].AddressChangeReport_SeriousViolationViolationPhoto.split("$@");
                           }else{
                              this.AddressChangeReport[0].ChangeReportPhoto2.push(this.AddressChangeReport[0].AddressChangeReport_SeriousViolationViolationPhoto);
                        }
                       }
                       //联系电话非本人使用或无法联系
                       this.TelephoneNoContact.push(response.data.data.manualentryinfo.TelephoneNoContact);
                       this.TelephoneNoContact[0].TelephoneNoContact_NowTime = this.formatTime(this.TelephoneNoContact[0].TelephoneNoContact_NowTime);
                       this.TelephoneNoContact[0].TelephoneNoContact_FindDate = this.formatTime(this.TelephoneNoContact[0].TelephoneNoContact_FindDate);
                       this.TelephoneNoContact[0].TelephoneNoContactPhoto1 = [];
                       this.TelephoneNoContact[0].TelephoneNoContactPhoto2 = [];
                       //照片
                      if(this.TelephoneNoContact[0].TelephoneNoContact_ProofUploadPhoto){
                      if(this.TelephoneNoContact[0].TelephoneNoContact_ProofUploadPhoto.indexOf("$@") > -1){
                               this.TelephoneNoContact[0].TelephoneNoContactPhoto1 = this.TelephoneNoContact[0].TelephoneNoContact_ProofUploadPhoto.split("$@");
                           }else{
                              this.TelephoneNoContact[0].TelephoneNoContactPhoto1.push(this.TelephoneNoContact[0].TelephoneNoContact_ProofUploadPhoto);
                       }
                      }
                       if(this.TelephoneNoContact[0].TelephoneNoContact_SeriousViolationViolationPhoto){
                       if(this.TelephoneNoContact[0].TelephoneNoContact_SeriousViolationViolationPhoto.indexOf("$@") > -1){
                               this.TelephoneNoContact[0].TelephoneNoContactPhoto2 = this.TelephoneNoContact[0].TelephoneNoContact_SeriousViolationViolationPhoto.split("$@");
                           }else{
                              this.TelephoneNoContact[0].TelephoneNoContactPhoto2.push(this.TelephoneNoContact[0].TelephoneNoContact_SeriousViolationViolationPhoto);
                        }
                       }
                       //签到
                       this.signinfo = response.data.data.signinfo;
                       for(var j=0;j<this.signinfo.length;j++){
                           this.signinfo[j].createTime = this.timeFormat(this.signinfo[j].createTime);
                           //人员照片
                          this.signinfo[j].signPhoto=[];
                          if(this.signinfo[j].Photo){
                           if(this.signinfo[j].Photo.indexOf("$@") > -1){
                               this.signinfo[j].signPhoto = this.signinfo[j].Photo.split("$@");
                           }else{
                               this.signinfo[j].signPhoto.push(this.signinfo[j].Photo);
                           }
                          }
                       }
                       //戒毒康复情况
                       this.RehabilitationInfo = response.data.data.RehabilitationInfo;
                       if(this.RehabilitationInfo.ReportDate){
                        //    this.RehabilitationInfo.ReportDate = this.RehabilitationInfo.ReportDate.substring(0,10);
                         this.RehabilitationInfo.ReportDate = this.formatTime(this.RehabilitationInfo.ReportDate);
                       }
                       if(this.RehabilitationInfo.RehabilitativeEndDate){
                           this.RehabilitationInfo.RehabilitativeEndDate = this.formatTime(this.RehabilitationInfo.RehabilitativeEndDate);
                       }
                       //决定书照片
                       this.RehabilitationInfo.RehabilitationPhoto = [];
                       if(this.RehabilitationInfo.RrotocolPhoto){
                          if(this.RehabilitationInfo.RrotocolPhoto.indexOf("$@")>-1){
                           this.RehabilitationInfo.RehabilitationPhoto = this.RehabilitationInfo.RrotocolPhoto.split("$@");
                            }else{
                                this.RehabilitationInfo.RehabilitationPhoto.push(this.RehabilitationInfo.RrotocolPhoto);
                            }
                       }
                       //期满中止终止
                       this.RelieveDrug = response.data.data.personnelstateinfo.RelieveDrug;
                       this.OverDrug = response.data.data.personnelstateinfo.OverDrug;
                       this.StopDrug = response.data.data.personnelstateinfo.StopDrug;
                       if(this.RelieveDrug.RelieveBeginDate == 0){
                           this.RelieveDrug.RelieveBeginDate = "";
                       }else{
                           this.RelieveDrug.RelieveBeginDate = this.formatTime(this.RelieveDrug.RelieveBeginDate);
                       }
                       if(this.RelieveDrug.RelieveDrugDate == 0){
                           this.RelieveDrug.RelieveDrugDate = "";
                       }else{
                           this.RelieveDrug.RelieveDrugDate = this.formatTime(this.RelieveDrug.RelieveDrugDate);
                       }
                       //图片
                       this.RelieveDrug.RelieveDrugPhoto = [];
                       if(this.RelieveDrug.ExaminePhotoupload){
                       if(this.RelieveDrug.ExaminePhotoupload.indexOf("$@")>-1){
                           this.RelieveDrug.RelieveDrugPhoto = this.RelieveDrug.ExaminePhotoupload.split("$@");
                       }else{
                           this.RelieveDrug.RelieveDrugPhoto.push(this.RelieveDrug.ExaminePhotoupload);
                       }
                       }
                        if(this.OverDrug.OverBeginDate == 0){
                           this.OverDrug.OverBeginDate = "";
                       }else{
                           this.OverDrug.OverBeginDate = this.formatTime(this.OverDrug.OverBeginDate);
                       }
                       if(this.OverDrug.OverDate == 0){
                           this.OverDrug.OverDate = "";
                       }else{
                           this.OverDrug.OverDate = this.formatTime(this.OverDrug.OverDate);
                       }
                       //图片
                       this.OverDrug.OverDrugPhoto = [];
                       if(this.OverDrug.OverReasonPhoto){
                       if(this.OverDrug.OverReasonPhoto.indexOf("$@")>-1){
                           this.OverDrug.OverDrugPhoto = this.OverDrug.OverReasonPhoto.split("$@");
                       }else{
                           this.OverDrug.OverDrugPhoto.push(this.OverDrug.OverReasonPhoto);
                       }
                       }

                       if(this.StopDrug.StopBeginDate == 0){
                           this.StopDrug.StopBeginDate = "";
                       }else{
                           this.StopDrug.StopBeginDate = this.formatTime(this.StopDrug.StopBeginDate);
                       }
                       if(this.StopDrug.StopDate == 0){
                           this.StopDrug.StopDate = "";
                       }else{
                           this.StopDrug.StopDate = this.formatTime(this.StopDrug.StopDate);
                       }
                       //图片
                       this.StopDrug.StopDrugPhoto = [];
                       if(this.StopDrug.StopReasonPhoto){
                       if(this.StopDrug.StopReasonPhoto.indexOf("$@")>-1){
                           this.StopDrug.StopDrugPhoto = this.StopDrug.StopReasonPhoto.split("$@");
                       }else{
                           this.StopDrug.StopDrugPhoto.push(this.StopDrug.StopReasonPhoto);
                       }
                       }
                    } else {
                        this.$notify({
                            title: '查询详情失败',
                            message: response.data.errmsg,
                            type: 'warning',
                            duration: 3000
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
           }
       }
   }
</script>

<style scoped>
    body{
        background: #022c6d;
    }
    img{
    transition: all .5s linear;
    transform: scale(1);
    }
    .big{
      transform: scale(2);
      z-index:100;
    }
    .breakProtocol{
        width: 100%;
    }
    .imgs img{
        width: 70px;
        height: 70px;
        margin:5px;
        display: inline-block;
    }
    .headImg{
        margin-top: 10px;
       /*  
        display: block;
        position: absolute;
        top: 50%;
        margin-top:-60px;
        left: 50%;
        margin-left: -50%; */
    }
    .breakProtocol li{
        width: 500px;
        display: inline-block;
        margin:10px 10px 0 0;
    }
    .detailWrapper {
        width: 100%;
        margin-top: 10px;
    }
    .infoTable{
        width: 100%;
        border-bottom: 1px solid #eee ;
        border-right: 1px solid #eee ;
    }
    .RehabilitationInfo,.finishTable{
        width: 100%;
        border-bottom: 1px solid #26477c ;
        border-left: 1px solid #26477c ;
    }
    .RehabilitationInfo table,.finishTable table{
        width: 100%;
    }
    .RehabilitationInfo,.finishTable,.commonDistance,.infoTable{
        margin: 20px 0; 
    }
    .infoTable td,
    .infoTable th {
        width: 12%;
        text-align: center;
        height: 40px;
        padding: 0 10px;
        border-top: 1px solid #eee ;
        border-right: 1px solid #eee ;
        font-size: 14px;
        font-weight: normal;
        color: #00c2ff;
    }
    .RehabilitationInfo th,.RehabilitationInfo td{
        width: 20%;
         text-align: center;
        height: 40px;
        padding: 0 10px;
        border-top: 1px solid #26477c ;
        border-right: 1px solid #26477c ;
        font-size: 14px;
        font-weight: normal;
        color: #00c2ff;
    }
    .finishTable th,.finishTable td{
        width: 20%;
        text-align: center;
        height: 40px;
        padding: 0 10px;
        border-top: 1px solid #26477c ;
        border-right: 1px solid #26477c ;
        font-size: 14px;
        font-weight: normal;
        color: #00c2ff;
    }
    .infoTable .tHeader {
        background: #508ce6;
        color: #fff;
    }
    .finishTable thead,.RehabilitationInfo thead
    {
        background:#2c5aa0;
    }
    .finishTable thead th,.RehabilitationInfo thead th{
        color: #fff;
    }
    .el-collapse-item__header {
        font-size: 16px !important;
    }
    .finishHeader {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        font-weight: normal;
        color: #90b5ef;
        margin:20px 0;
    }
    .endDeclare {
        text-indent: 26px;
        margin-top: 20px;
        color: #fff;
    }
    .endDeclare b,
    .workStationInfo p b {
        border-bottom: 1px solid #bbb;
        padding: 0 12px;
        font-weight: normal;
        color: #00c2ff;
    }
    .workStationInfo {
        margin-top: 50px;
    }
    .workStationInfo p {
        text-align: right;
        margin-bottom: 20px;
        color: #fff;
    }
    .btnBack{
        font-size: 14px;
        float: left;
    }
     .clear:after {  
        content: "."; 
        display: block;
         height: 0;
          clear: both; 
          visibility: hidden;
    }
    .clearfix { *zoom:1; }
    .typeIn{
        float: right;
    }
    .signInfo{
        color: #ee4750 !important;
    }
    .amap-demo {
      width: 100%;
      height: 450px;
    }
</style>
