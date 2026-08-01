"""align schema with restructure

Revision ID: b1d4e8f29c70
Revises: 7a473101a3c3
Create Date: 2026-08-01 12:09:35.332963

"""
from datetime import date, datetime, time, timezone
from typing import Sequence, Union
from uuid import uuid4

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b1d4e8f29c70'
down_revision: Union[str, None] = '7a473101a3c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _upgrade_user_roles() -> None:
    if op.get_bind().dialect.name == "postgresql":
        op.execute("ALTER TYPE role RENAME TO role_legacy")
        op.execute("CREATE TYPE role AS ENUM ('supporter', 'member', 'admin')")
        op.execute(
            """
            ALTER TABLE users
            ALTER COLUMN role TYPE role
            USING (
                CASE
                    WHEN role::text IN ('donor', 'volunteer') THEN 'supporter'
                    ELSE role::text
                END
            )::role
            """
        )
        op.execute("DROP TYPE role_legacy")
        return

    op.execute("UPDATE users SET role = 'supporter' WHERE role IN ('donor', 'volunteer')")


def _downgrade_user_roles() -> None:
    if op.get_bind().dialect.name == "postgresql":
        op.execute("ALTER TYPE role RENAME TO role_current")
        op.execute("CREATE TYPE role AS ENUM ('donor', 'volunteer', 'member', 'admin')")
        op.execute(
            """
            ALTER TABLE users
            ALTER COLUMN role TYPE role
            USING (
                CASE WHEN role::text = 'supporter' THEN 'donor' ELSE role::text END
            )::role
            """
        )
        op.execute("DROP TYPE role_current")
        return

    op.execute("UPDATE users SET role = 'donor' WHERE role = 'supporter'")


def _copy_legacy_admin_data() -> None:
    connection = op.get_bind()
    legacy_events = sa.table(
        "admin_events",
        sa.column("title", sa.String()),
        sa.column("description", sa.Text()),
        sa.column("event_date", sa.Date()),
        sa.column("location", sa.String()),
        sa.column("max_capacity", sa.Integer()),
        sa.column("category", sa.String()),
        sa.column("status", sa.String()),
        sa.column("created_at", sa.DateTime(timezone=True)),
    )
    activities = sa.table(
        "activities",
        sa.column("title", sa.String()),
        sa.column("starts_at", sa.DateTime(timezone=True)),
        sa.column("ends_at", sa.DateTime(timezone=True)),
        sa.column("location", sa.String()),
        sa.column("description", sa.Text()),
        sa.column("max_capacity", sa.Integer()),
        sa.column("category", sa.String()),
        sa.column("status", sa.String()),
        sa.column("created_at", sa.DateTime(timezone=True)),
    )
    for event in connection.execute(sa.select(legacy_events)).mappings():
        starts_at = event["event_date"]
        if isinstance(starts_at, date) and not isinstance(starts_at, datetime):
            starts_at = datetime.combine(starts_at, time.min, tzinfo=timezone.utc)
        connection.execute(
            activities.insert().values(
                title=event["title"][:200],
                starts_at=starts_at,
                ends_at=None,
                location=event["location"],
                description=event["description"],
                max_capacity=event["max_capacity"],
                category=str(event["category"]),
                status=str(event["status"]),
                created_at=event["created_at"],
            )
        )

    legacy_programs = sa.table(
        "admin_volunteer_programs",
        sa.column("id", sa.Integer()),
        sa.column("title", sa.String()),
        sa.column("description", sa.Text()),
        sa.column("category", sa.String()),
        sa.column("schedule", sa.String()),
        sa.column("location", sa.String()),
        sa.column("filled", sa.Integer()),
        sa.column("total", sa.Integer()),
        sa.column("status", sa.String()),
        sa.column("created_at", sa.DateTime(timezone=True)),
    )
    volunteer_activities = sa.table(
        "volunteer_activities",
        sa.column("slug", sa.String()),
        sa.column("icon", sa.String()),
        sa.column("title", sa.String()),
        sa.column("description", sa.Text()),
        sa.column("schedule_label", sa.String()),
        sa.column("location_label", sa.String()),
        sa.column("category", sa.String()),
        sa.column("filled_count", sa.Integer()),
        sa.column("total_spots", sa.Integer()),
        sa.column("note", sa.String()),
        sa.column("cta_label", sa.String()),
        sa.column("status", sa.String()),
        sa.column("display_order", sa.Integer()),
        sa.column("created_at", sa.DateTime(timezone=True)),
    )
    for program in connection.execute(sa.select(legacy_programs)).mappings():
        connection.execute(
            volunteer_activities.insert().values(
                slug=f"legacy-program-{program['id']}",
                icon="heart",
                title=program["title"][:200],
                description=program["description"],
                schedule_label=program["schedule"][:120],
                location_label=program["location"][:200],
                category=str(program["category"]),
                filled_count=program["filled"],
                total_spots=program["total"],
                note=None,
                cta_label="I'm interested",
                status="inactive" if str(program["status"]) == "filled" else "active",
                display_order=1000 + program["id"],
                created_at=program["created_at"],
            )
        )


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('activities',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('starts_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('ends_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('location', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('max_capacity', sa.Integer(), nullable=True),
    sa.Column('category', sa.String(length=50), nullable=True),
    sa.Column('status', sa.String(length=30), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_activities_id'), 'activities', ['id'], unique=False)
    op.create_index(op.f('ix_activities_starts_at'), 'activities', ['starts_at'], unique=False)
    op.create_index(op.f('ix_activities_status'), 'activities', ['status'], unique=False)
    op.create_table('activity_signups',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('supporter_id', sa.Integer(), nullable=False),
    sa.Column('activity_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=30), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], ),
    sa.ForeignKeyConstraint(['supporter_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('supporter_id', 'activity_id', name='uq_supporter_activity_signup')
    )
    op.create_index(op.f('ix_activity_signups_activity_id'), 'activity_signups', ['activity_id'], unique=False)
    op.create_index(op.f('ix_activity_signups_id'), 'activity_signups', ['id'], unique=False)
    op.create_index(op.f('ix_activity_signups_supporter_id'), 'activity_signups', ['supporter_id'], unique=False)
    op.create_table('donations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('supporter_id', sa.Integer(), nullable=True),
    sa.Column('support_opportunity_id', sa.Integer(), nullable=True),
    sa.Column('donor_email', sa.String(length=255), nullable=True),
    sa.Column('donor_name', sa.String(length=200), nullable=True),
    sa.Column('amount_hkd', sa.Integer(), nullable=False),
    sa.Column('frequency', sa.String(length=30), nullable=False),
    sa.Column('status', sa.String(length=30), nullable=False),
    sa.Column('payment_reference', sa.String(length=80), nullable=False),
    sa.Column('message', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['support_opportunity_id'], ['support_opportunities.id'], ),
    sa.ForeignKeyConstraint(['supporter_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_donations_id'), 'donations', ['id'], unique=False)
    op.create_index(op.f('ix_donations_payment_reference'), 'donations', ['payment_reference'], unique=True)
    op.create_index(op.f('ix_donations_support_opportunity_id'), 'donations', ['support_opportunity_id'], unique=False)
    op.create_index(op.f('ix_donations_supporter_id'), 'donations', ['supporter_id'], unique=False)
    op.create_table('newsletter_deliveries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('subject', sa.String(length=300), nullable=False),
    sa.Column('content_text', sa.Text(), nullable=False),
    sa.Column('content_html', sa.Text(), nullable=False),
    sa.Column('recipient_count', sa.Integer(), nullable=False),
    sa.Column('sent_by_user_id', sa.Integer(), nullable=True),
    sa.Column('sent_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['sent_by_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_newsletter_deliveries_id'), 'newsletter_deliveries', ['id'], unique=False)
    op.create_table('volunteer_hours',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('supporter_id', sa.Integer(), nullable=False),
    sa.Column('activity_id', sa.Integer(), nullable=True),
    sa.Column('hours', sa.Float(), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('logged_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], ),
    sa.ForeignKeyConstraint(['supporter_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_volunteer_hours_activity_id'), 'volunteer_hours', ['activity_id'], unique=False)
    op.create_index(op.f('ix_volunteer_hours_id'), 'volunteer_hours', ['id'], unique=False)
    op.create_index(op.f('ix_volunteer_hours_supporter_id'), 'volunteer_hours', ['supporter_id'], unique=False)
    _upgrade_user_roles()
    _copy_legacy_admin_data()
    op.drop_index('ix_admin_volunteer_programs_id', table_name='admin_volunteer_programs')
    op.drop_table('admin_volunteer_programs')
    op.drop_index('ix_admin_events_id', table_name='admin_events')
    op.drop_table('admin_events')
    op.drop_index('ix_analytics_events_event_name', table_name='analytics_events')
    op.drop_index('ix_analytics_events_id', table_name='analytics_events')
    op.drop_index('ix_analytics_events_occurred_at', table_name='analytics_events')
    op.drop_index('ix_analytics_events_session_id', table_name='analytics_events')
    op.drop_index('ix_analytics_events_user_id', table_name='analytics_events')
    op.drop_table('analytics_events')
    op.drop_index('ix_analytics_daily_rollups_metric_key', table_name='analytics_daily_rollups')
    op.drop_index('ix_analytics_daily_rollups_rollup_date', table_name='analytics_daily_rollups')
    op.drop_table('analytics_daily_rollups')
    with op.batch_alter_table('newsletter_subscribers') as batch_op:
        batch_op.add_column(sa.Column('unsubscribe_token', sa.String(length=64), nullable=True))
    subscribers = sa.table(
        'newsletter_subscribers',
        sa.column('id', sa.Integer()),
        sa.column('unsubscribe_token', sa.String(length=64)),
    )
    connection = op.get_bind()
    subscriber_ids = connection.execute(sa.select(subscribers.c.id)).scalars()
    for subscriber_id in subscriber_ids:
        connection.execute(
            subscribers.update()
            .where(subscribers.c.id == subscriber_id)
            .values(unsubscribe_token=uuid4().hex)
        )
    with op.batch_alter_table('newsletter_subscribers') as batch_op:
        batch_op.alter_column('unsubscribe_token', existing_type=sa.String(length=64), nullable=False)
        batch_op.alter_column('first_name', existing_type=sa.String(length=120), type_=sa.String(length=100), existing_nullable=False)
        batch_op.alter_column('last_name', existing_type=sa.String(length=120), type_=sa.String(length=100), existing_nullable=False)
        batch_op.alter_column('phone_number', existing_type=sa.String(length=40), type_=sa.String(length=50), nullable=True)
        batch_op.alter_column(
            'status',
            existing_type=sa.Enum('active', 'unsubscribed', name='subscriberstatus'),
            type_=sa.String(length=30),
            existing_nullable=False,
            postgresql_using='status::text',
        )
        batch_op.create_index(op.f('ix_newsletter_subscribers_status'), ['status'], unique=False)
        batch_op.create_index(op.f('ix_newsletter_subscribers_unsubscribe_token'), ['unsubscribe_token'], unique=True)
    op.add_column('support_opportunities', sa.Column('image_url', sa.String(length=500), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('support_opportunities', 'image_url')
    op.execute("UPDATE newsletter_subscribers SET phone_number = '' WHERE phone_number IS NULL")
    with op.batch_alter_table('newsletter_subscribers') as batch_op:
        batch_op.drop_index(op.f('ix_newsletter_subscribers_unsubscribe_token'))
        batch_op.drop_index(op.f('ix_newsletter_subscribers_status'))
        batch_op.alter_column(
            'status',
            existing_type=sa.String(length=30),
            type_=sa.Enum('active', 'unsubscribed', name='subscriberstatus'),
            existing_nullable=False,
            postgresql_using='status::subscriberstatus',
        )
        batch_op.alter_column('phone_number', existing_type=sa.String(length=50), type_=sa.String(length=40), nullable=False)
        batch_op.alter_column('last_name', existing_type=sa.String(length=100), type_=sa.String(length=120), existing_nullable=False)
        batch_op.alter_column('first_name', existing_type=sa.String(length=100), type_=sa.String(length=120), existing_nullable=False)
        batch_op.drop_column('unsubscribe_token')
    op.create_table('analytics_daily_rollups',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('rollup_date', sa.DATE(), nullable=False),
    sa.Column('metric_key', sa.VARCHAR(length=120), nullable=False),
    sa.Column('dimensions', sa.JSON(), nullable=True),
    sa.Column('value', sa.INTEGER(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('rollup_date', 'metric_key', name='uq_rollup_date_metric')
    )
    op.create_index('ix_analytics_daily_rollups_rollup_date', 'analytics_daily_rollups', ['rollup_date'], unique=False)
    op.create_index('ix_analytics_daily_rollups_metric_key', 'analytics_daily_rollups', ['metric_key'], unique=False)
    op.create_table('analytics_events',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('occurred_at', sa.DATETIME(), nullable=False),
    sa.Column('event_name', sa.VARCHAR(length=120), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.Column('session_id', sa.VARCHAR(length=64), nullable=True),
    sa.Column('locale', sa.VARCHAR(length=8), nullable=True),
    sa.Column('page_path', sa.VARCHAR(length=255), nullable=True),
    sa.Column('source', sa.VARCHAR(length=16), nullable=False),
    sa.Column('properties', sa.JSON(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_analytics_events_user_id', 'analytics_events', ['user_id'], unique=False)
    op.create_index('ix_analytics_events_session_id', 'analytics_events', ['session_id'], unique=False)
    op.create_index('ix_analytics_events_occurred_at', 'analytics_events', ['occurred_at'], unique=False)
    op.create_index('ix_analytics_events_id', 'analytics_events', ['id'], unique=False)
    op.create_index('ix_analytics_events_event_name', 'analytics_events', ['event_name'], unique=False)
    op.create_table('admin_events',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('title', sa.VARCHAR(length=255), nullable=False),
    sa.Column('description', sa.TEXT(), nullable=False),
    sa.Column('event_date', sa.DATE(), nullable=False),
    sa.Column('location', sa.VARCHAR(length=255), nullable=False),
    sa.Column('registrations', sa.INTEGER(), nullable=False),
    sa.Column('max_capacity', sa.INTEGER(), nullable=False),
    sa.Column('category', sa.VARCHAR(length=11), nullable=False),
    sa.Column('status', sa.VARCHAR(length=9), nullable=False),
    sa.Column('created_at', sa.DATETIME(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_admin_events_id', 'admin_events', ['id'], unique=False)
    op.create_table('admin_volunteer_programs',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('title', sa.VARCHAR(length=255), nullable=False),
    sa.Column('description', sa.TEXT(), nullable=False),
    sa.Column('category', sa.VARCHAR(length=9), nullable=False),
    sa.Column('schedule', sa.VARCHAR(length=255), nullable=False),
    sa.Column('location', sa.VARCHAR(length=255), nullable=False),
    sa.Column('filled', sa.INTEGER(), nullable=False),
    sa.Column('total', sa.INTEGER(), nullable=False),
    sa.Column('status', sa.VARCHAR(length=7), nullable=False),
    sa.Column('created_at', sa.DATETIME(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_admin_volunteer_programs_id', 'admin_volunteer_programs', ['id'], unique=False)
    _downgrade_user_roles()
    op.drop_index(op.f('ix_volunteer_hours_supporter_id'), table_name='volunteer_hours')
    op.drop_index(op.f('ix_volunteer_hours_id'), table_name='volunteer_hours')
    op.drop_index(op.f('ix_volunteer_hours_activity_id'), table_name='volunteer_hours')
    op.drop_table('volunteer_hours')
    op.drop_index(op.f('ix_newsletter_deliveries_id'), table_name='newsletter_deliveries')
    op.drop_table('newsletter_deliveries')
    op.drop_index(op.f('ix_donations_supporter_id'), table_name='donations')
    op.drop_index(op.f('ix_donations_support_opportunity_id'), table_name='donations')
    op.drop_index(op.f('ix_donations_payment_reference'), table_name='donations')
    op.drop_index(op.f('ix_donations_id'), table_name='donations')
    op.drop_table('donations')
    op.drop_index(op.f('ix_activity_signups_supporter_id'), table_name='activity_signups')
    op.drop_index(op.f('ix_activity_signups_id'), table_name='activity_signups')
    op.drop_index(op.f('ix_activity_signups_activity_id'), table_name='activity_signups')
    op.drop_table('activity_signups')
    op.drop_index(op.f('ix_activities_status'), table_name='activities')
    op.drop_index(op.f('ix_activities_starts_at'), table_name='activities')
    op.drop_index(op.f('ix_activities_id'), table_name='activities')
    op.drop_table('activities')
    # ### end Alembic commands ###
