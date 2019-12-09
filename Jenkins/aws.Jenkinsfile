node ('Build'){
    echo "Deploying to AWS ECS"
    def artCredentialID = '1c5d5f9a-db60-4799-9f6f-6d12750f5f7f'
    def awsArtifactory = env.AWS_ARTIFACTORY_HOST
    def urlArt = "https://${env.ARTIFACTORY_HOST}"
    def imageName = "${params.IMAGE_NAME}"
    def taskDef = "${params.TASK_DEF}"
    def cluster = "${params.CLUSTER}"
    def noOfCluster = "${params.NO_OF_CLUSTER}"
    def repo = 'frontend-api'
    def imageTag = "latest"
    def awsRegion = env.AWS_REGION
    def awsImageName = 'aws-cli-docker'
    def awsImageTag = 'latest'
    def awsImage = "${env.ARTIFACTORY_HOST}/${env.ARTIFACTORY_PATH}/${awsImageName}:${awsImageTag}"
    stage('Checkout'){
        def build_env = "${params.BUILD_ENV}"
        def gitBranch = "release/${params.TAG}"
        def gitUrl = env.CIT_GIT_FRONTEND_API_URL
        def gitCredentialID = 'e7acb748-22b5-47e2-b5c8-f740048baac1'
        git branch: gitBranch, credentialsId: gitCredentialID, url: gitUrl
        echo "Checking out $repo form $gitUrl, branch $gitBranch"
    }
    stage ('Clean docker images'){
      sh "docker images --format '{{.Repository}}:{{.Tag}}' | grep '$imageName' | xargs --no-run-if-empty docker rmi --force"
    }
    stage ('Pull AWS-CLI image'){
      withDockerRegistry(credentialsId: artCredentialID, url: urlArt)  {
          sh "docker pull ${awsImage}"
          //Verify
          sh "docker run ${awsImage} aws --version"
      }
    }
    stage('Build docker image'){
        sh "docker build --label $imageName -t $awsArtifactory/$imageName:$imageTag ./"
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'aws', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
            sh "docker run -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} -e AWS_DEFAULT_REGION=${awsRegion} ${awsImage} aws ecr get-login --no-include-email | sh"
            sh "docker push $awsArtifactory/$imageName:$imageTag"
            echo "Build and push successfully!"
        }
    }
    stage("Start ECS instances"){
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'aws', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
            sh "docker run --rm -e CLUSTER=${cluster} -e NO_OF_CLUSTER=${noOfCluster} -e TASK_DEF=${taskDef} -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} -e AWS_DEFAULT_REGION=${awsRegion} ${awsImage} /bin/sh /scripts/runEcs.sh"
        }
        echo "Start $noOfCluster instance(s) !!!"
        
    }
}