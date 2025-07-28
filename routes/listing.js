    const express=require("express");
    const router=express.Router();
    const Listing=require("../models/listing.js");
    const wrapAsync=require("../utils/wrapAsync.js");
    const {isLoggedIn,isOwner,validateListing}=require("../middlewares.js");  
    const User = require("../models/user.js");

    //Index route 
    router.get("/",wrapAsync(async(req,res)=>{
        const allListings =await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }));
    //new Route
    router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
        res.render("listings/new.ejs")
    }));

    //show route
    router.get("/:id",wrapAsync(async (req,res)=>{
        let {id}=req.params;
        console.log(id);
        try{
            const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); 
            
        if(!listing){
            req.flash("error","Listing your are asking for does not exist");
            res.redirect("/listings"); 
        }
        res.render("listings/show.ejs",{listing});
        }catch(error) {
            console.log("error in get invidual listing",error);
        }
    }));
    //create Route
    router.post("/",validateListing,
        wrapAsync(  async(req,res,next)=>{
            const newListing=new Listing(req.body.listing);
            newListing.owner=req.user._id;
            await newListing.save();
            req.flash("success","New Listing Created!");
            res.redirect("/listings"); 
        }));

    //edit route
    router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing your are asking for does not exist");
            res.redirect("/listings"); 
        }
        req.flash("success","Listing Edited!");
        res.render("listings/edit.ejs",{listing}) ;
    }));
    //update route
    router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
    }));
    //delete route  
    router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res) => {
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings")
    }
    ));

    module.exports=router;