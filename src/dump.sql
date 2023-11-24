create database pdv

create table usuarios
(id serial primary key,
 nome text not null,
 email text not null unique,
 senha text not null
);

create table categorias
(id serial primary key,
 descricao text not null
);