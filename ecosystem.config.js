module.exports = {
    apps: [{
      script: 'attendanceServer.js',
      instances: "2",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development"
      },
    //   env_local: {
    //     NODE_ENV: "local",
    //   },
      env_dev: {
        NODE_ENV: "dev",
      },
      env_qa: {
        NODE_ENV: "qa",
      },
    //   env_production: {
    //     NODE_ENV: "production",
    //   }
    }],
  
    deploy: {
    //   local: {
    //     "host": ["localhost"],
    //     "ref": "origin/version_115",
    //     "repo": "https://gitlab+deploy-token-676347:q4iKhsPFgrC48sTucLws@gitlab.com/TruckLagbe/tl_quickbook.git",
    //     "path": "/home/antukbala/Desktop/all_projects/Quickbook_Project/tl_quickbook",
    //     'post-deploy': 'sudo npm install && sudo pm2 startOrRestart ecosystem.config.js --env local'
    //   },
  
    //   production: {
    //     "user": "ubuntu",
    //     "host": ["18.141.116.139"],
    //     "port": "46963",
    //     "ref": "origin/production",
    //     "repo": `https://gitlab+deploy-token-875568:H9ZP8PzFZzVRrz8quUr7@devops.trucklagbe.com/tl-back/tl_quickbook.git`,
    //     "path": "/home/TL/tl_quickbook",
    //     'post-deploy': 'sudo npm install && sudo pm2 startOrRestart ecosystem.config.js --env production'
    //   },
  
      qa: {
        "user": "custodian",
        "host": ["103.199.168.130"],
        "port": "3716",
        "ref": "origin/version_101",
        "repo": `git@github.com:antukbala/attendance_log.git`,
        "path": "/home/custodian/z_attendance_test",
        'post-deploy': 'npm install &&  pm2 startOrRestart ecosystem.config.js --env qa'
      },
  
      dev: {
        "user": "shepherd",
        "host": ["103.199.168.135"],
        "port": "53220",
        "ref": "origin/version_101",
        "repo": `git@github.com:antukbala/attendance_log.git`,
        "path": "/home/shepherd/z_attendance_test",
        'post-deploy': 'npm install &&  pm2 startOrRestart ecosystem.config.js --env dev'
      }
    }
  };
  