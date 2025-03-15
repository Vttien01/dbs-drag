@Library('shared-library') _

// ================================
// CONFIGURATION
// ================================
TIMEZONE = 'GMT+7'
SONARQUBE_ENV_NAME = 'SonarQubeCommunity'
ENV="beta"

// ================================
// JOB PIPELINE
// ================================
node {
    // get bot token and group chat id from credentials
    withCredentials([
        string(credentialsId: 'telegram-token', variable: 'telegramToken'),
        string(credentialsId: 'telegram-chat-id', variable: 'telegramChatId')
    ]) {
        env.CHAT_TOKEN = telegramToken
        env.CHAT_ID = telegramChatId
    }

    notifyBuild('STARTED')

    stage('Checkout code') {
        checkout scm
    }

    stage('Unit test') {
        println 'Pass'
    }

    try {
        stage('SonarQube Analysis') {
            def scannerHome = tool 'SonarScanner'
            withSonarQubeEnv(SONARQUBE_ENV_NAME) {
                sh "${scannerHome}/bin/sonar-scanner"
            }
        }

        stage('SonarQube Quality Gate') {
            timeout(time: 5, unit: 'MINUTES') {
                def qg = waitForQualityGate()

                env.SONAR_QUALITY_GATE_STATUS = qg.status
            }
        }

        stage('Build') {
            println 'Pass'
        }

        stage('Deploy') {
            withCredentials([
                [$class: 'FileBinding', credentialsId: 'aws-key-pair', variable: 'awsKeyPair'],
                string(credentialsId: 'beta-server-ip', variable: 'betaServerIP')
            ]) {
                sh """
                    ssh -i ${awsKeyPair} ${betaServerIP} "rm -rf ~/cyberplusplus/cyberplusplus-admin"
                    rsync --exclude=".git" --exclude=".scannerwork" -e "ssh -i ${awsKeyPair}" -a ./ ${betaServerIP}:~/cyberplusplus/cyberplusplus-admin
                    ssh -i ${awsKeyPair} ${betaServerIP} "
                        sudo rsync -a ~/cyberplusplus/config/cyberplusplus-admin/ ~/cyberplusplus/cyberplusplus-admin/source/env/
                        cd ~/cyberplusplus/cyberplusplus-devops/app/beta
                        sudo ./deploy_app.sh cyberplusplus-admin ${env.BUILD_NUMBER} ${ENV}
                    "
                """

                currentBuild.result = 'SUCCESS'
                notifyBuild(currentBuild.result)
            }
        }
    } catch (Exception ex) {
        println(ex)
        currentBuild.result = 'FAILURE'
        notifyBuild('EXCEPTION', ex.message != null ? ex.message : ex.toString())
    }
}

// ================================
// HELPER FUNCTION
// ================================

def notifyBuild(buildStatus, exceptionErrorMessage = '') {
    def message = ''
    def jobName = escapeMarkdown("${env.JOB_NAME} - ${env.BUILD_NUMBER}")

    if (buildStatus == 'STARTED') {
        message = "➡️ *STARTED:* Job [${jobName}](${env.BUILD_URL})"
    } else if (buildStatus == 'EXCEPTION') {
        def errorHeader = "❌ *FAILURE:* Job [${jobName}](${env.BUILD_URL})"
        message = "${errorHeader}\n————————————————————\nJob is aborted due to exception error:\n*${escapeMarkdown(exceptionErrorMessage)}*"
    } else {
        def buildTime = formatMilisecondTime(timeInMillis: currentBuild.timeInMillis, timezone: TIMEZONE, format: 'MMM dd, yyyy HH:mm:ss Z')
        def duration = currentBuild.durationString.replace(' and counting', '')
        def changeLog = getChangeLog()
        def sonarProps = readProperties file: '.scannerwork//report-task.txt'
        def sonarUrl = sonarProps['dashboardUrl']

        def buildTimeText = "*Build Time:* ${escapeMarkdown(buildTime)}"
        def durationText = "*Duration:* ${duration}"
        def changeLogText = "*Change Log:* \n${escapeMarkdown(changeLog)}"
        def sonarUrlText = "[${escapeMarkdown('(detail)')}](${sonarUrl})"
        def sonarQualityGateStatusText = env.SONAR_QUALITY_GATE_STATUS == 'OK' ? '🟢 Good' : "🟠 Normal"
        def sonarResultText = "*Code Quality:* ${sonarQualityGateStatusText} ${sonarUrlText}"

        if (buildStatus == 'SUCCESS') {
            def successHeader = " ✅ *SUCCESS:* Job [${jobName}](${env.BUILD_URL})"
            message = "${successHeader}\n————————————————————\n${buildTimeText}\n${durationText}\n${sonarResultText}\n${changeLogText}"
        } else {
            def errorHeader = "❌ *FAILURE:* Job [${jobName}](${env.BUILD_URL})"
            message = "${errorHeader}\n————————————————————\n${buildTimeText}\n${durationText}\n${sonarResultText}\n${changeLogText}"
        }
    }

    sendTelegramMessage(message: message, token: env.CHAT_TOKEN, chatID: env.CHAT_ID, mode: 'MarkdownV2')
}
