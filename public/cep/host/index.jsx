// function openDocument() {
//     var fileRef = new File("~/Downloads/gitflow001.jpg");
//     var docRef = app.open(fileRef);
// }

function psActionPlugin () {}

psActionPlugin.prototype = {
  testScript: function () {
    alert('I am a script and I work');
  },
  addNewLayer: function () {
    //创建一个尺寸为 400 像素 X 400 像素的文档，分辨率为 72 ，文档名称为："一个脚本创建的文件"。
    //并且用变量 newDoc 记录这个图层。
    var newDoc = app.documents.add(UnitValue("400 px"), UnitValue("400 px"), 72 ,"一个脚本创建的文件");

    // 在 newDoc 中添加一个图层。并且用变量 newLayer 记录这个图层。
    var newLayer = newDoc.artLayers.add();

    //把图层 newLayer 的图层类型变为”文本“ ，图层转换为文本图层。
    newLayer.kind = LayerKind.TEXT

    //把图层 newLayer 的文本内容类型变为”文本框“。
    newLayer.textItem.kind = TextType.PARAGRAPHTEXT

    //设置图层 newLayer 的文本框宽度与高度。
    newLayer.textItem.width = "300px"
    newLayer.textItem.height = "150px"

    //设置图层 newLayer 的文本框位置，横坐标 50 像素，纵坐标 100 像素。
    newLayer.textItem.position= [UnitValue("50px"), UnitValue("100px")]

    //设置 newLayer 的文本字体大小为“40 点”。
    newLayer.textItem.size = UnitValue("40 pt")

    //设置 newLayer 的文本内容。
    newLayer.textItem.contents= "Holle World!"

    //设置 newLayer 的文本框对齐方式为居中对齐。
    newLayer.textItem.justification = Justification.CENTER

    //创建一个色彩变量 c   ，颜色为 #77bb11。
    var c = new SolidColor();
    c.rgb.hexValue = "77bb11";

    //设置 newLayer 的文本颜色为 c。
    newLayer.textItem.color = c;
  },
  exportDocument: function () {
    var filePath = app.activeDocument.fullName
    var folderPath = filePath.toString().split('/').slice(0,-1).join('/') + '/';
    var sanitizedFilePath = File(filePath).fsName
    // var exportOptions = new ExportOptionsSaveForWeb()
    // exportOptions.format = SaveDocumentType.PNG
    // app.activeDocument.exportDocument(File(sanitizedFilePath), ExportType.SAVEFORWEB, exportOptions)
    var pngSaveOptions = new PNGSaveOptions();
    pngSaveOptions.interlaced = false;
    pngSaveOptions.typename = 'test'
    app.activeDocument.saveAs(File(sanitizedFilePath), pngSaveOptions, true);
    return File(sanitizedFilePath)
  }
}

var psAction = new psActionPlugin()


// function initApp () {
//   // 多个jsx后台程序入口
//   $.evalFile('./action.jsx')
//   psAction = new psActionPlugin()
// }

// initApp()

function test () {
    alert('I am a script and I work');
}