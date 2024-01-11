"""empty message

Revision ID: 8bbd4bdd11a0
Revises: 5c6f725d3c12
Create Date: 2024-01-11 10:48:15.976728

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8bbd4bdd11a0'
down_revision = '5c6f725d3c12'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('specializations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('specializations')
    # ### end Alembic commands ###
