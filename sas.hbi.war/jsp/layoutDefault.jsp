<div id=dvRslt>
    <div id="dvTitle" style="display:none;">
		<div id="dvSystemTitle" style="display:none;"></div>
        <div id="dvInfoMessage" style="display:none;">
            <span id="info_msg" class="confItem" style="position: relative;float:left;padding-left:10px;margin-left: 3px;"></span>
        </div>
        <div id="dvTitleButtons" style="text-align: right;">
            <span id="uploadMessageBox" class="confItem" style="position: relative;float: left;padding-left: 10px;margin-left: 3px;"></span>
            <input type="button" id="btnAddRow" class="btn_basic" value="행추가" title="행추가" onclick="addRow();" style="display: none;">
            <input type="button" id="btnAddRowCust" class="btn_basic" value="행추가" title="행추가" onclick="custAddRow();" style="display: none;">
        </div>
    </div>
    <div id="dvOutput" style="display: none;">
        <table id="tblOutput" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="2">
                    <div id="dvGraph1"></div>
                </td>
            </tr>
            <tr>
                <td><div id="dvBox"></div></td>
                <td valign="top"><div id="dvColumnHeader"></div></td>
            </tr>
            <tr>
                <td style="vertical-align: top;"><div id="dvRowHeader"></div></td>
                <td style="vertical-align: top;"><div id="dvData"></div></td>
            </tr>
            <tr>
                <td colspan="2">
                    <div id="dvPagePanel" style="text-align: center;"></div>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div id="dvGraph2"></div>
                </td>
            </tr>
        </table>
    </div>
    <div id="dvFooter" style="display: none;">
        <div id="dvFooterButtons" align="right">
            <input type="button" id="btnUpload" class="btn_basic" value="엑셀 업로드" />
            <input type="button" id="btnDelete" class="btn_basic" value="삭제" />
            <input type="button" id="btnSave" class="btn_basic" value="저장" />
        </div>
    </div>
</div>
<div id="dvRes" style="display: none;"></div>