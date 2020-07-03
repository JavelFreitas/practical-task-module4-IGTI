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

### Task endpoints

5. **/transactions/deposit**

    * Body params:  
    "agencia": Number,  
	"conta": Number,  
	"deposito": Number  

    * Return: Updated account info

6. **/transactions/withdraw**

    * Body params:  
    "agencia": Number,  
	"conta": Number,  
	"saque": Number  

    * Return: Updated account info

7. **/transactions/getBalance**

    * Body params:  
    "agencia": Number,  
	"conta": Number  

    * Return: Balance of the account

8. **/transactions/deleteAccount**

    * Body params:  
    "agencia": Number,  
	"conta": Number  

    * Return: Account remaining in that agency

9. **/transactions/transfer**

    * Body params:  
    "contaOrigem": Number,  
	"contaDestino": Number,  
	"valor": Number  

    * Return: Balance of the principal account for the transfer

10. **/transactions/averageBalance/:agencia**

    * Params: Number of the agency

    * Return: Average balance of that agency

11. **/transactions/ascendingBalance/:limite**  

    * Params: Limit of accounts to be listed
    
    * Return: List of accounts (Balance in ascending order)

12. **/transactions/descendingBalance/12**  

    * Params: Limit of accounts to be listed
    
    * Return: List of accounts (Balance in descending order)

13. **/transactions/transferTopClients**

    ``` Transfer the client with the largest amount of balance from each agency to agency 99  ```

    * Params: None

    * Return: Updated list of all accouts with 99 agency

14.  **/transactions/deleteAll**

    * Params: None

    * Return: Delete the database entirely