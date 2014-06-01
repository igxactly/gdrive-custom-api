// front-end request handler
function doGet(e) {
  var n =
      (e.parameters.limitlen == undefined) ?
      10 : e.parameters.limitlen;

  var f = (e.parameters.type == 'folder') ? getDriveFolderListObj(n) : getDriveFileListObj(n);

  var h = ContentService.createTextOutput(JSON.stringify(f));
  return h;
}

// 0 (zero) means ALL
function getDriveFileListObj(e) {
  var filesIter = DriveApp.getFiles();

  var ret =
      {
        "datatype": "filelist",
        "count": 0,
        "list": []
      };

  var counter = (e == undefined || e < 0) ? 10 : e;

  var infiniteFlag = (e == 0) ? true : false;

  while (counter >= 0 && filesIter.hasNext()) {
    var f = filesIter.next();
    if (!f.isTrashed()) {
      ret.list.push(getFileInfoObj(f));
      ret.count += 1;
      if (!infiniteFlag)
        counter--;
    }
  }

  return ret;
}

// 0 (zero) means ALL
function getDriveFolderListObj(e) {
  var foldersIter = DriveApp.getFolders();

  var ret =
      {
        "datatype": "folderlist",
        "count": 0,
        "list": []
      };

  var counter = (e == undefined || e < 0) ? 10 : e;

  var infiniteFlag = (e == 0) ? true : false;

  while (counter >= 0 && foldersIter.hasNext()) {
    var f = foldersIter.next();
    if (!f.isTrashed()) {
      ret.list.push(getFileInfoObj(f));
      ret.count += 1;
      if (!infiniteFlag)
        counter--;
    }
  }

  return ret;
}


function getFileInfoObj(f) {
  var a = {};

  if (f != null) {
    var ret = {
      "id": f.getId(),
      "name": f.getName(),
      "createTime": f.getDateCreated(),
      "lastModTime": f.getLastUpdated(),
      "parentList": getParentsInfoObj(f)};

    return ret;
  }

  else {
    return a;
  }
}

function getParentsInfoObj(f) {
  var parents = f.getParents();

  var ret = [];

  while (parents.hasNext()) {
    var p = parents.next();
    var p_obj = p.getId();

    ret.push(p_obj);
  }

  return ret;
}

function getFileInformationByID(e) {
  var file = DriveApp.getFileById(e);

  if (file != null) {
    var name = file.getName();
    var lastTimestamp = file.getLastUpdated();
    var parents = file.getParents();
    var retStr = name + lastTimestamp;

    while (parents.hasNext()) {
      retStr = retStr + parents.next().getName();
    }

    return retStr;
  }
  else {
    return '';
  }
}
