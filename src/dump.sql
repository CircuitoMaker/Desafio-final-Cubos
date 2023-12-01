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

insert into categorias (descricao)
values 
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games')

create table produtos(
  id serial primary key,
  descricao text not null,
  quantidade_estoque integer not null,
  valor integer not null,
  categoria_id integer references categorias(id)
);

create table clientes(
id serial primary key,
  nome varchar(30) not null,
  email varchar(30) not null unique,
  cpf varchar(15) not null unique,
  cep varchar(10) not null,
  rua varchar(30) not null,
  numero integer not null,
  bairro varchar(15) not null,
  cidade varchar(15) not null,
  estado varchar(15) not null
)
