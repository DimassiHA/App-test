# Generated by Django 5.1.6 on 2025-03-20 21:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_customuser_region_client'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='region',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
