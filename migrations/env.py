import logging
from logging.config import fileConfig
import sys
import os
from alembic import context
from sqlalchemy import engine_from_config, pool
from flask import current_app
from flask import current_app
from flask import current_app

# Standard library imports

# Third-party imports

# Local imports (import inside functions to avoid circular imports)
# from myapp import create_app, db

# Alembic Config object, provides access to .ini values
config = context.config

# Set up logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

def get_engine_url():
    """
    Retrieve the SQLALCHEMY_DATABASE_URI from the Flask app config.
    The .replace('%', '%%') is required because configparser interprets
    '%' as interpolation, which can break URLs with percent signs.
    """
    try:
        url = current_app.config.get('SQLALCHEMY_DATABASE_URI')
        if url is None:
            raise RuntimeError("SQLALCHEMY_DATABASE_URI is not set in app config.")
        return url.replace('%', '%%')
    except Exception as e:
        logger.error(f"Error retrieving database URL: {e}")
        raise

def get_metadata():
    """
    Import the db object and return its metadata.
    Import inside function to avoid circular imports.
    """
    db = current_app.extensions['sqlalchemy'].db
    return db.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = get_engine_url()
    context.configure(
        url=url,
        target_metadata=get_metadata(),
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""

    conf_args = config.get_section(config.config_ini_section)
    # Mutate conf_args to set SQLAlchemy URL from Flask config
    conf_args['sqlalchemy.url'] = get_engine_url()  # Documented mutation

    connectable = engine_from_config(
        conf_args,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
