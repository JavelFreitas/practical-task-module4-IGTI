# Practical Challenge - module 4

Practical challenge from IGTI's 2020 Fullstack Bootcamp.

## Objective

To practice Mongodb knowledge acquired during Module 4 classes.

## About the project

```
The api manages a mongodb database, with basic CRUD and other functionalities. 
```

## Aplication endpoints

### Basic CRUD
1. **/transactions**

    Params: None

    Return: All accounts and transactions

2. **/transactions/create**

    * Body params:  
    "agencia" : Number,  
	"conta" : Number,  
	"name" : "String",  
	"balance" : Number

    * Return: 200 OK, the information of creation and the id for the account.

3. **/transactions/delete/:id**

    * Params: Id of the account to be deleted

    * Return: Information of the deleted account

4. **/transactions/update/:id**

    * Params: Id of the account to be updated

    * Body params: Information to be updated 

    * Return: Updated information of the account  