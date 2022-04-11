#!/bin/bash

#Prueba register correcto e incorrecto
curl -X POST -d "username=prueba&passwd=prueba&email=prueba@unizar.es" http://localhost:3000/register
echo ""
curl -X POST -d "username=prueba&passwd=prueba&email=prueba@unizar.es" http://localhost:3000/register
echo ""

#Prueba login correcta e incorrecta(user y passwd)
curl -X GET -d "username=prueba&passwd=prueba" http://localhost:3000/login
echo ""
curl -X GET -d "username=prueba2&passwd=prueba" http://localhost:3000/login
echo ""
curl -X GET -d "username=prueba&passwd=prueba2" http://localhost:3000/login
echo ""

#Prueba borrar correcto e incorrecto
curl -X POST -d "username=prueba" http://localhost:3000/login/delete
echo ""
curl -X POST -d "username=prueba" http://localhost:3000/login/delete
echo ""
