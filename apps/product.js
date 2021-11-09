const schema = require("../models/products");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// function StringID(length) {
//      var result           = '';
//      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//      var charactersLength = characters.length;
//      for ( var i = 0; i < length; i++ ) {
//           result += characters.charAt(Math.floor(Math.random() *
//           charactersLength));
//      }
//      return result;
// }


const fileStorageEngine = multer.diskStorage({
     destination:(req,file,cb)=>{
          cb(null,"./images")
     },
     filename:(req,file,cb)=>{
          cb(null, Date.now() + "--" + file.originalname);
     }
});

const upload = multer({storage:fileStorageEngine});

function ProductPage(req,res){

     schema.find((err, data)=>{

          var printdata = [[]];
          var count=0;
          var index=0;

          if(err){
               console.log("Error");
               console.log(err);
               res.send("Error");
               return;
          }

          for(var i in data){
               printdata[index].push([
                    data[i].title,
                    data[i].price,
                    data[i].description,
                    data[i].imglink
               ]);

               count+=1;
               if(count==4){
                    printdata.push([]);
                    count=0;
                    index+=1;
               }
          }

          res.render("product",{data:printdata});
     });

}

function ProductManagePage(req, res){
     res.render("prodview", {
               checkvar:1,
               data:["0","0","0","0"]
          }
     );
}


function AddProduct(req, res){
     if(!req.body){
          return res.sendStatus(400);
     }

     var title = req.body.title;
     var price = req.body.price;
     var origin = req.body.origin;
     var descript = req.body.description;
     if(descript==""){
          descript="None";
     }

     if(title=="" ||price=="" ||origin=="None"||req.file==undefined){
          res.redirect("/prodview");
     }

     return;
}

function UpdateProd(req, res){
     if(!req.body){
          return res.sendStatus(400);
     }
     if(req.body.title==""){
          res.render("prodview", {
               checkvar:2,
               data:["0","0","0","0"]
          });
          return;
     }
     schema.find({title:req.body.title}, (error, data)=>{
          if(error){
               console.log(error);
               console.log("Error detected");
          }else{
               if(data.length==0){
                    res.render("prodview", {
                         checkvar:3,
                         data:["0","0","0","0"]
                    });
                    return;
               }
               var array = [];

               array.push(data[0].title);
               array.push(data[0].price);
               array.push(data[0].origin);
               array.push(data[0].description);

               console.log("Found query result");

               res.render("prodview", {
                    checkvar:4,
                    data:array
               });
          }
     });
}

function Search(req, res){
     res.render("search",{result:[]});
}

function SearchProcess(req,res){

     if(!req.body || req.body.search==""){
          res.redirect("search");
          return;
     }

     schema.find({title:req.body.search}, (error, data)=>{
          if(error){
               res.send("something went wrong");
               console.log(error);
               return;
          }

          if(data.length==0){
               res.render("search",{
                    result:[null]
               });
               return;
          }
          res.render("search", {
               result:[
                    data[0].title,
                    data[0].price,
                    data[0].origin,
                    data[0].description,
                    data[0].imglink
               ]
          });
     });
}

module.exports = {
     _ProdManage_ : ProductManagePage,
     _ProdList_ : ProductPage,
     _Product_Update : UpdateProd,
     _AddProduct_ : AddProduct,
     _SearchProd_ : Search,
     _SearchAnalyze_ : SearchProcess,
     upload:upload
};
