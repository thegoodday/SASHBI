<div id="dvRslt">
    <div id="dvTitle" style="display:none;">
        <div id="dvInfoMessage" style="display:none;">
            <span id="info_msg" class="confItem" style="position: relative;float:left;padding-left:10px;margin-left: 3px;"></span>
        </div>
        <div id="dvTitleButtons" style="text-align: right;">
            <span id="uploadMessageBox" class="confItem" style="position: relative;float: left;padding-left: 10px;margin-left: 3px;"></span>
            <input type="button" id="btnAddRow" class="btn_basic" value="행추가" title="행추가" onclick="addRow();" style="display: none;">
            <input type="button" id="btnAddRowCust" class="btn_basic" value="행추가" title="행추가" onclick="custAddRow();" style="display: none;">
        </div>
    </div>
    <div id="sasGrid" style="display: none;"></div>
    <div id="dvFooter" style="display: none;">
        <div id="dvFooterButtons" align="right">
            <input type="button" id="btnUpload" class="btn_basic" value="엑셀 업로드"  style="display: none;"/>
            <input type="button" id="btnDelete" class="btn_basic" value="삭제"  style="display: none;"/>
            <input type="button" id="btnSave" class="btn_basic" value="저장"  style="display: none;"/>
        </div>
    </div>
</div>
<ul id="contextmenuUl" class="cascadeFirst"></ul>