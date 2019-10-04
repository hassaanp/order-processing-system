# order-processing-system

A set of microservices designed to implement the order and payment processing system.

## Getting Started

These instructions will get you a working API that you can interact with.

### Prerequisites

What things you need to run the system and how to install them

* [node.js](https://nodejs.org/en/download/)
* npm (will be automatically installed with node)
* [docker](https://docs.docker.com/install/)
* [docker-compose](https://docs.docker.com/compose/install/)
* [insomnia](https://insomnia.rest/download/)

### Starting the services

To launch the set of services, just run the following:

```
docker-compose up
```

If you want to run the services in the background then add the `-d` flag

```
docker-compose up -d
```

In order to rebuild the services add the --build flag at the end

```
docker-compose --build
```

### Access the API

To access the API you can send out curl requests to `http://localhost:8000/api` or better, open Insomnia Rest Client and import the collection provided `insomnia_collection.json` to view the complete set of routes with sample body provided.

## Architecture

The overall architecture includes two node.js applications, a messaging broker, a gateway and a database service. The entire application is brought up with docker-compose as a proof of concept which can be replaced with a simple kubernetes cluster.

Here is a diagramatic overview of the system:
![](https://ibb.co/6wWyFyn)

### Authentication

Authentication middleware has been placed as a dummy that always returns appends a user's details in the request object. A string/token has been hardcoded to protect all routes that needs to be passed in the request authorization header. This mocks an already signed in user behavior where a signed in session will automatically be sending a JWT token for example, in the authorization header.

To make the application work please add this hardcoded token in the request header:
```
Authorization: thisisajwttoken
```

### Orders API
A user is allowed to create an order, cancel an order, get a specific order or get all their orders.

#### Routes
* GET /api/orders - gets all the orders for the user
* POST /api/orders - creates an order against the user
* GET /api/orders/{id} - gets a specific order for the user
* DELETE /api/orders/{id} - cancels a specific order for the user

The provided Insomnia collection has all the routes provided with prefilled request body, headers etc.

#### Events Pushed to Messaging Broker
* payment-create-event - pushed to the broker whenever an order is created so that a corresponding payment object is created

#### Events Received from Messaging Broker
* payment-processed-event - received whenever a payment is processed. Can be a denied payment or an accepted payment. Based on the status the appropriate event handler is invoked

#### Cron Job
* Whenever an order is confirmed, a timer is added to the callback queue to process the order and change the status to delivered after a hardcoded time.

### Payments API
A user can get a specific payment using the order ID or can get all their payments as well as initiate a payment for a specific order.

* GET /api/payments - gets all the payments for the user
* GET /api/payments/{orderId} - gets a specific payment against an order for the user
* POST /api/payments/pay/{orderId} - initiates a payment against an order for the user.

A sample body for the last route is provided  as below:
```
{
	"creditCardDetails": {
		"number": "10298310928301",
		"cvt": 345,
		"expiry": "4/12/2020"
	}
}
```

The provided Insomnia collection has all the routes provided with prefilled request body, headers etc.

#### Events Pushed to Messaging Broker
* payment-processed-event - pushed whenever a payment is processed. Can be a denied payment or an accepted payment.

#### Events Received from Messaging Broker
* payment-create-event - received whenever an order is created so that a corresponding payment object is created

## Built With

* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js

## Authors

* **Hassaan Pasha** - [website](https://hassaanpasha.com)

## Acknowledgments

* [PurpleBooth](https://github.com/PurpleBooth) for the awesome [README](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) template

