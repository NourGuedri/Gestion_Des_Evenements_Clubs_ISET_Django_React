# Generated by Django 5.0.4 on 2024-05-11 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('club', '0009_alter_membership_state'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membership',
            name='state',
            field=models.CharField(choices=[('PENDING', 'Pending'), ('REJECTED', 'Rejected'), ('REMOVED', 'Removed'), ('ACTIVE', 'Active')], default='PENDING', max_length=100),
        ),
    ]
