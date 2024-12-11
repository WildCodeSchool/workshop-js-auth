create table user (
  id int unsigned primary key auto_increment not null,
  email varchar(255) not null unique,
  hashed_password varchar(255) not null,
  is_admin boolean not null default false
);

create table item (
  id int unsigned primary key auto_increment not null,
  title varchar(255) not null,
  user_id int unsigned not null,
  foreign key(user_id) references user(id)
);

insert into user(id, email, hashed_password)
values
  (1, "jdoe@mail.com", "$argon2id$v=19$m=19456,t=2,p=1$nz6t40CzCcijUhj3Ntpz9A$4DW+9sqLdKvj27E3JYbImIIfZAadyDGXHFiwpBHli4s");

insert into item(id, title, user_id)
values
  (1, "Stuff", 1),
  (2, "Doodads", 1);
