const readline = require("readline");
const isValidHandle = require("./utility/utility.js"),
    hasRepo = require("./utility/utility.js"),
    hasBranch = require("./utility/utility.js"),
    createBranch = require("./utility/utility.js"),
    createRepo = require("./utility/utility.js"),
    showTree = require("./utility/utility.js"),
    listBranch = require("./utility/utility.js"),
    listOfRepos = require("./utility/utility.js"),
    saveTree = require("./utility/utility.js");
      
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
​
let repo_name ='Assignment-1';
let new_branch='Branch-3';
let new_repo ='sample_repo2';
​
input.question("\nEnter the github handle to proceed ...\n\n", async function (username) {
    var login, isRepoTrue, repositories, isBranchTrue, branch, newBranch;
    console.log(`You have entered '${username}' .\n`);
    await isValidHandle(username, (err,res) =>{
        login = response;
    });
    if(login!==null)
    {
        console.log(`${username} is a valid Handler`);
        await hasRepo(username, (err,res) =>{
            isRepoTrue = res;
        })
        if(isRepoTrue === true)
        {
            await listOfRepos(username, (err,res) =>{
                repositories = res;
            });
            await hasBranch(username, (err,res) =>{
                isBranchTrue = res;
            });
            if(isBranchTrue === true)
            {
                await listBranch(username,repo_name, (err,res)=>{
                    branch=res;
                });
                if(saveTree(username))
                {
                    await showTree();
                }
            }
            else
            {
                await createBranch(username,repo_name,new_branch, (err,res)=>{
                    newBranch = res;
                });
                await listBranch(username,repo_name, (err,res)=>{
                    branch=res;
                });
            }
        }
        else
        {
            await createRepo(new_repo, (err,res) =>{
                repo_created = res;
                if(repo_created== true){
                    console.log('repository created');
                } else{
                    console.log('repository not created');
                }
            });
            await listOfRepos(username, (err,res) =>{
                repositories = res;
            });
        }
    }
    else
    {
        console.log("Invalid Git Handle ..\n Program Aborted.");
    }
input.close();
});
