const initData=require("./data.js");
const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>(
        {...obj,owner:"679493e255a89775320f15f2",
    }));
    await Listing.insertMany(initData.data);
}
initDB();
