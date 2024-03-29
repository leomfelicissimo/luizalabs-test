
#Luiza Labs Test

## Description

This application was created as part of the Luiza Labs's interview process.

## Solution

### Nest Framework and Database

It uses NestJs and a proprietary data structure of database. I had an idea of creating a 
database like data structure map-based. I hope you like, because I really liked it.

### Typescript
I'm using typescript generics concepts (that I bring com C# and Java experience), 
the "repo" pattern concepts (a quite different of repository), that I bring from my Elixir experience.

### Products scraping and caching

For searching products I'm scraping the products search, page by page and building a local cache with the products.
I'm doing it, because the GET products/{id} was returning 404 for all product ids.
The trade-off is: If a product got updated, we will not get this updated data. For resolve this, we needed a TTL, and
reseting the products what could be a problem because going page by page is slow.

The best approach here, is to receive a product update event by webhook or AMQP and update the local database.

But I believe that this would be too much for the interview purposes.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
$ yarn start
```

## Test

I've focused on creating integration tests and not unit tests.

```bash
# integration tests
$ yarn test
```

## How to use the API

The best approach of documentation here would be to create a swagger with descriptions and examples.
But lets keep it simple.

I've exported a Insomnia Scratch Pad for helping to running the tests. You will find it in the root
directory named: *insomnia-collection.json*

I've tried to use Postman, but sorry, my postman was buggy :'(

### 1. Login as Admin to create new users

The admin user is accountable for creating API users. The admin credentials is hardcoded for now.
But the best approach would be to have it in a configuration, allowing the password to be changed.

```bash
curl --request POST \
  --url http://localhost:3000/auth/login \
  --header 'Content-Type: application/json' \
  --header 'OpenAI-Beta: assistants=v1' \
  --header 'User-Agent: insomnia/8.4.5' \
  --data '{
	"clientId": "luizalabs",
	"password": "12345678"
}'
```

### 2. Use your Admin token to create the API user

Now, you will create the API user, I thought it as a API Gateway credentials, where for each app you
would have a credential.

```bash
curl --request POST \
  --url http://localhost:3000/auth/register \
  --header 'Authorization: Bearer {{adminToken}}' \
  --header 'Content-Type: application/json' \
  --header 'OpenAI-Beta: assistants=v1' \
  --header 'User-Agent: insomnia/8.4.5' \
  --data '{
	"clientId": "frontEndApp",
	"password": "87654321"
}'
```

### 3. Login with your created API user

Using this request you will be able to access for using the other endpoints. Admin should be able to do it as well.

```bash
curl --request POST \
  --url http://localhost:3000/auth/login \
  --header 'Content-Type: application/json' \
  --header 'OpenAI-Beta: assistants=v1' \
  --header 'User-Agent: insomnia/8.4.5' \
  --data '{
	"clientId": "frontEndApp",
	"password": "87654321"
}'
```

### 4. Create a customer using the token of your API user

This endpoint will return the customer data with ID, please, store the id for use it for customer handling calls.

```bash
curl --request POST \
  --url http://localhost:3000/customers \
  --header 'Authorization: Bearer {{apiUserToken}}' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
	"email": "leomfelicissimo@gmail.com",
	"name": "Leonardo"
}'
```

### 5. Add a product to a customer wishlist

A wishlist is always created along side the customer creation. For now the customer cannot have more than 1 wishlist.
I've tried to keep a semantic RESTful concept. Where the wishlist is not a isolated domain, but a subdomain of User domain.
It's a PUT and not a POST because we are primarily updating the a specific customers resource.

```bash
curl --request PUT \
  --url http://localhost:3000/customers/{{customerId}}/wishlists \
  --header 'Authorization: Bearer {{apiUserToken}}' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
	"productId": "6e1f37ff-d3d4-88cc-dbbf-5747a327694f"
}'
```

### 6. Check the wishlist

You could use this request, for checking the customers wishlist. Actually only one wishlist will be returned.

```bash
curl --request GET \
  --url http://localhost:3000/customers/{{customerId}}/wishlists \
  --header 'Authorization: Bearer {{apiUserToken}}' \
  --header 'User-Agent: insomnia/8.6.1'
```

### 7. Remove a product from wishlist
If you want to remove a product from wish list, use this request.

```bash
curl --request DELETE \
  --url http://localhost:3000/customers/a5ae6b26-f804-4efe-b55a-4ee470a96af1/wishlists \
  --header 'Authorization: Bearer {{apiUserToken}}' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
	"productId": "77be5ad3-fa87-d8a0-9433-5dbcc3152fac"
}'
```

### (Additional) Delete a customer
If you want to remove a customer, use this.

```bash
curl --request DELETE \
  --url http://localhost:3000/customers/{{customerId}} \
  --header 'Authorization: Bearer {{apiUserToken}}' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
	"productId": "77be5ad3-fa87-d8a0-9433-5dbcc3152fac"
}'
```

### (Additional) Get a customer
Use this, to get details of customer by id

```bash
curl --request GET \
  --url http://localhost:3000/customers/a5ae6b26-f804-4efe-b55a-4ee470a96af1 \
  --header 'Authorization: Bearer {{apiUserToken}}' \
  --header 'User-Agent: insomnia/8.6.1'
```

### (Additional) Get a customer
Use this, to see all customers on database. Here we could add a paged search.
But is simple for now.

```bash
curl --request GET \
  --url http://localhost:3000/customers \
  --header 'Authorization: Bearer {{apiUserToken}}' \
  --header 'User-Agent: insomnia/8.6.1'
```

## Stay in touch

- Author - [Leonardo Felicissimo](https://www.linkedin.com/in/leomfelicissimo/)
