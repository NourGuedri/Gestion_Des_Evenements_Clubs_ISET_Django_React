# Generated by Django 5.0.4 on 2024-05-07 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_profile_is_admin'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='department',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='profile',
            name='group',
            field=models.IntegerField(default=100),
        ),
        migrations.AddField(
            model_name='profile',
            name='university',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
