import mysql.connector
import argparse
import re

def create_database(cursor, db_name):
    try:
        cursor.execute(f"CREATE DATABASE {db_name};")
    except mysql.connector.Error as err:
        print(f"Failed creating database: {err}")
        exit(1)

def create_user(cursor, username, password):
    try:
        cursor.execute(f"CREATE USER '{username}'@'%' IDENTIFIED BY '{password}';")
        # TODO: Grant only necessary privileges
        cursor.execute(f"GRANT ALL PRIVILEGES ON *.* TO '{username}'@'%' WITH GRANT OPTION;")
    except mysql.connector.Error as err:
        print(f"Failed creating user: {err}")
        exit(1)

def run_sql_file(cursor, file_path):
    with open(file_path, 'r', encoding='utf-8') as file:  # Set encoding to utf-8
        sql_script = file.read()
    commands = sql_script.split(';')
    for command in commands:
        try:
            if command.strip() != '':
                cursor.execute(command)
        except mysql.connector.Error as err:
            print(f"Failed executing command: {err}")
            exit(1)
  
def main(args):
    cnx = None
    cursor = None
    try:
        cnx = mysql.connector.connect(
            host=args.host,
            port=args.port,
            user=args.root_user,
            password=args.root_password
        )
        cursor = cnx.cursor()

        create_database(cursor, args.db_name)
        create_user(cursor, args.new_user, args.new_password)
        cursor.execute(f"USE {args.db_name};")
        run_sql_file(cursor, args.sql_file)

        cnx.commit()
        print("Database setup completed successfully.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Set up a MySQL database and user.")
    parser.add_argument("host", help="MySQL server host (e.g., localhost)")
    parser.add_argument("port", type=int, help="MySQL server port (e.g., 3306)")
    parser.add_argument("root_user", help="MySQL root user")
    parser.add_argument("root_password", help="MySQL root user password")
    parser.add_argument("new_user", help="Name of the new database user")
    parser.add_argument("new_password", help="Password for the new database user")
    parser.add_argument("db_name", help="Name of the database to create")
    parser.add_argument("sql_file", help="Location of the SQL file for database structure")

    args = parser.parse_args()
    main(args)
