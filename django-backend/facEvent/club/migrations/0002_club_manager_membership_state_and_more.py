# Generated by Django 5.0.4 on 2024-05-02 16:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('club', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='club',
            name='manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='membership',
            name='state',
            field=models.CharField(choices=[('PENDING', 'Pending'), ('ACTIVE', 'Active'), ('REJECTED', 'Rejected'), ('REMOVED', 'Removed')], default='PENDING', max_length=100),
        ),
        migrations.AlterField(
            model_name='membership',
            name='position',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
