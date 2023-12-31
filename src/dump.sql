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
  nome text not null,
  email text not null unique,
  cpf text not null unique,
  cep text,
  rua text,
  numero integer,
  bairro text,
  cidade text,
  estado text
);


ALTER TABLE clientes
ALTER COLUMN cep DROP NOT NULL,
ALTER COLUMN rua DROP NOT NULL,
ALTER COLUMN numero DROP NOT NULL,
ALTER COLUMN bairro DROP NOT NULL,
ALTER COLUMN cidade DROP NOT NULL,
ALTER COLUMN estado DROP NOT NULL;

create table pedidos
(id serial primary key,
 cliente_id integer not null references clientes(id),
 observacao text,
 valor_total integer
);

create table pedidos_produtos
(id serial primary key,
 pedido_id integer references pedidos(id),
 produto_id integer not null references produtos(id),
 quantidade_produto integer not null,
 valor_produto integer
);

alter table produtos
add produto_imagem text

drop table pedidos_produtos;
drop table pedidos;




create table pedidos
(id serial primary key,
 cliente_id integer not null,
 observacao text,
 valor_total integer
);

create table pedido_produtos
(id serial primary key,
 pedido_id integer not null,
 produto_id integer not null,
 quantidade_produto integer not null,
 valor_produto integer
);
