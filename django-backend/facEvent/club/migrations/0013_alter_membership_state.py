# Generated by Django 5.0.4 on 2024-05-12 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('club', '0012_alter_membership_state'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membership',
            name='state',
            field=models.CharField(choices=[('REMOVED', 'Removed'), ('PENDING', 'Pending'), ('ACTIVE', 'Active'), ('REJECTED', 'Rejected')], default='PENDING', max_length=100),
        ),
    ]
