import os
import subprocess
import sys

def run_command(command):
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {e}")
        sys.exit(1)

def build_docker_image(path, tag, build_arg=None):
    os.chdir(path)
    cmd = f"docker build -t {tag} "
    if build_arg:
        cmd += f"--build-arg {build_arg} "
    cmd += "."
    run_command(cmd)

def push_docker_image(tag):
    run_command(f"docker push {tag}")

def main():
    client_path = "../client"
    server_path = "../server"

    environment = input("Enter the environment (prod/dev/test): ")

    if (environment == "test"):
        cmd = "docker-compose -f docker-compose.testing.yaml --env-file .env.testing up --detach --build"
        run_command(cmd)
        if input("Stop containers? (y/n): ") == "y":
            run_command("docker-compose -f docker-compose.testing.yaml down")
        return
    
    client_env = "production" if environment == "prod" else "development"
    version = input("Enter the version number (X.Y.Z): ")

    # Build client
    client_tag = f"jbtit/neomdb:client{version}"
    build_arg = f"REACT_APP_ENV={client_env}"
    build_docker_image(client_path, client_tag, build_arg)

    # Build server
    server_tag = f"jbtit/neomdb:server{version}"
    build_docker_image(server_path, server_tag)

    # Push images
    push_docker_image(client_tag)
    push_docker_image(server_tag)
    print("Docker images built and pushed successfully.")

if __name__ == "__main__":
    main()
