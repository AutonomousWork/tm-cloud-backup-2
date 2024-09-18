# TypingMind S3 Backup Extension

[If you found this useful, please consider buying me a coffee](https://buymeacoffee.com/itcon):heart:!

## Features
- Extension to enable automatic backup & restore of app data to S3.
- Automatically restores the latest backup version from S3 to your TypingMind instance when you first open the app (provided a backup exists).
- Enables automatic backing up of your TypingMind data to S3 throughout the session.
  
## Using this extension
1. Load "https://itcon-pty-au.github.io/typingmind-cloud-backup/s3.js" into Menu > Preferences > Extension in Typingmind.
2. Once the extension is installed, a new Backup button will be added to the menu. Clicking on this will bring up the S3 backup configuration form.
3. Provide the AWS details in the form. [These are stored locally in your browser]
4. The save button checks if there is a backup already in S3, if yes it restores it and updates the local typingmind instance.
5. Manually refresh the page to reflect the new data. CTRL + F5 if it does not.
4. If there is no backup in S3, it is expected that you do an adhoc "Export to S3" to kickstart the process.
3. You can do adhoc cloud backups and restore using the respective buttons in the form - "Export to S3" and "Import from S3".
4. When the local data is changed, the extension triggers a backup to S3 automatically. However, these calls are capped at 1 every 5 seconds.

## AWS Config
1. Create a user in Amazon IAM
2. Create Access Key for the user
3. Click on Permissions tab > Add Permissions > Create Inline Policy > Click on JSON view. Paste the below policy into the policy editor. This policy allows read and write access to the specific backup file.
``
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:GetObject",
				"s3:PutObject"
			],
			"Resource": "arn:aws:s3:::<AWS bucket name>/typingmind-backup.json"
		}
	]
}
``
4. Create a bucket. Due to security reasons, it is recommended to create a new bucket for this activity and ensure that no other files are stored in it.
5. Open Bucket > Permissions > Bucket Policy
``
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<AWS Account ID>:user/<IAM username>"
            },
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::<AWS bucket name>/*"
        }
    ]
}
``
Update AWS Account ID, IAM username and AWS bucket name in the policy with your specific values.

6. Open Bucket > Permissions > CORS
``
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "PUT",
            "POST"
        ],
        "AllowedOrigins": [
            "https://*.hostname.com"
        ],
        "ExposeHeaders": [
            "Access-Control-Allow-Origin"
        ],
        "MaxAgeSeconds": 3000
    }
]
``
If you are using typingcloud, use the below
``
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "PUT",
            "POST"
        ],
        "AllowedOrigins": [
            "https://www.typingmind.com"
        ],
        "ExposeHeaders": [
            "Access-Control-Allow-Origin"
        ],
        "MaxAgeSeconds": 3000
    }
]
``
Update "https://*.hostname.com" with your specific hostname in case you are self hosting Typingmind (e.g. https://chat.yourhostname.com). If you are using Typingmind cloud, hostname should be https://www.typingmind.com. This restricts executing S3 commands from only the specified hostname providing better security.

## About me
I am a passionate developer dedicated to creating useful tools that can benefit the community. My goal is to distribute all of my projects as open source, enabling others to learn, contribute, and innovate together. If you appreciate my work and want to support my efforts, feel free to [buy me a coffee](https://buymeacoffee.com/itcon) :heart:!

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
