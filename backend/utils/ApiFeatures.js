class ApiFeature{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
      
    }

    search(){
        let searchItem=this.queryStr.keyword;
        if(!searchItem)
        searchItem="";
        this.query=this.query.find({name:{$regex:searchItem,$options:"i"}});
   
    //    return this;
    }
    filter(){
        let queryStrCopy={...this.queryStr};
        const removeFields=["keyword","page","limit"];
       removeFields.forEach(key=>delete queryStrCopy[key]);
       
        let queryString=JSON.stringify(queryStrCopy);
        queryString=queryString.replace(/(lt|lte|gt|gte)/gi,(match)=>`$${match}`);
        
     this.query=this.query.find(JSON.parse(queryString));

    //  return this;


    }
    pagination(resultPerPage){
       const curPage=this.queryStr.page;
       const skipItems=resultPerPage*(curPage-1);
       this.query=this.query.limit(resultPerPage).skip(skipItems);
    }
}

module.exports=ApiFeature;