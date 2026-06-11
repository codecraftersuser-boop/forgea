"""add tags column to courses

Revision ID: 003
Revises: 002
Create Date: 2026-06-11
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "courses",
        sa.Column("tags", postgresql.ARRAY(sa.String()), server_default="{}", nullable=False),
    )
    # Tag all existing courses
    op.execute("""
    UPDATE courses SET tags = ARRAY[]::text[] WHERE tags IS NULL;

    -- WEB BEGINNER
    UPDATE courses SET tags = ARRAY['html','css','responsive'] WHERE id = 240;
    UPDATE courses SET tags = ARRAY['html','css','javascript','git'] WHERE id = 241;
    UPDATE courses SET tags = ARRAY['javascript','algorithms'] WHERE id = 242;
    UPDATE courses SET tags = ARRAY['html','css'] WHERE id = 243;
    UPDATE courses SET tags = ARRAY['javascript','react','nodejs'] WHERE id = 244;
    UPDATE courses SET tags = ARRAY['programming','algorithms'] WHERE id = 245;

    -- WEB INTERMEDIATE
    UPDATE courses SET tags = ARRAY['python','javascript','web'] WHERE id = 246;
    UPDATE courses SET tags = ARRAY['react','javascript','html','css'] WHERE id = 247;
    UPDATE courses SET tags = ARRAY['python','django','sql'] WHERE id = 248;
    UPDATE courses SET tags = ARRAY['javascript','react','nodejs','sql'] WHERE id = 249;
    UPDATE courses SET tags = ARRAY['react','javascript'] WHERE id = 250;
    UPDATE courses SET tags = ARRAY['nodejs','express','mongodb'] WHERE id = 251;
    UPDATE courses SET tags = ARRAY['react','nodejs'] WHERE id = 252;
    UPDATE courses SET tags = ARRAY['nodejs','apis','sql'] WHERE id = 253;

    -- WEB ADVANCED
    UPDATE courses SET tags = ARRAY['testing','javascript'] WHERE id = 254;
    UPDATE courses SET tags = ARRAY['nextjs','react','ssr'] WHERE id = 255;
    UPDATE courses SET tags = ARRAY['system_design','architecture'] WHERE id = 256;
    UPDATE courses SET tags = ARRAY['software_engineering','agile'] WHERE id = 257;
    UPDATE courses SET tags = ARRAY['agile','project_management'] WHERE id = 258;

    -- WEB PROFESSIONAL
    UPDATE courses SET tags = ARRAY['aws','cloud','devops'] WHERE id = 259;
    UPDATE courses SET tags = ARRAY['docker','kubernetes','devops'] WHERE id = 260;
    UPDATE courses SET tags = ARRAY['ux','design'] WHERE id = 261;
    UPDATE courses SET tags = ARRAY['microservices','nodejs','react'] WHERE id = 262;

    -- DATA BEGINNER
    UPDATE courses SET tags = ARRAY['python'] WHERE id = 263;
    UPDATE courses SET tags = ARRAY['machine_learning','data_science'] WHERE id = 264;
    UPDATE courses SET tags = ARRAY['pandas','python','data_analysis'] WHERE id = 265;
    UPDATE courses SET tags = ARRAY['visualization','data_analysis'] WHERE id = 266;
    UPDATE courses SET tags = ARRAY['python','numpy','statistics'] WHERE id = 267;
    UPDATE courses SET tags = ARRAY['python','programming'] WHERE id = 268;
    UPDATE courses SET tags = ARRAY['python','sql'] WHERE id = 269;

    -- DATA INTERMEDIATE
    UPDATE courses SET tags = ARRAY['python','pandas','data_analysis'] WHERE id = 270;
    UPDATE courses SET tags = ARRAY['machine_learning','sklearn'] WHERE id = 271;
    UPDATE courses SET tags = ARRAY['machine_learning','feature_engineering'] WHERE id = 272;
    UPDATE courses SET tags = ARRAY['analytics','sql','visualization'] WHERE id = 273;
    UPDATE courses SET tags = ARRAY['python','machine_learning','sql'] WHERE id = 274;
    UPDATE courses SET tags = ARRAY['python','ai','machine_learning'] WHERE id = 275;
    UPDATE courses SET tags = ARRAY['machine_learning','statistics'] WHERE id = 276;
    UPDATE courses SET tags = ARRAY['sql','data_analysis'] WHERE id = 277;

    -- DATA ADVANCED
    UPDATE courses SET tags = ARRAY['deep_learning','tensorflow','neural_networks'] WHERE id = 278;
    UPDATE courses SET tags = ARRAY['machine_learning','tensorflow','sklearn'] WHERE id = 279;
    UPDATE courses SET tags = ARRAY['nlp','deep_learning','transformers'] WHERE id = 280;
    UPDATE courses SET tags = ARRAY['deep_learning','pytorch','computer_vision'] WHERE id = 281;
    UPDATE courses SET tags = ARRAY['machine_learning','python','sklearn'] WHERE id = 282;
    UPDATE courses SET tags = ARRAY['airflow','data_pipelines','data_engineering'] WHERE id = 283;
    UPDATE courses SET tags = ARRAY['pytorch','deep_learning'] WHERE id = 284;

    -- DATA PROFESSIONAL
    UPDATE courses SET tags = ARRAY['mlops','cloud','deployment'] WHERE id = 285;
    UPDATE courses SET tags = ARRAY['llm','mlops','generative_ai'] WHERE id = 286;
    UPDATE courses SET tags = ARRAY['llm','prompt_engineering','generative_ai'] WHERE id = 287;
    UPDATE courses SET tags = ARRAY['data_engineering','spark','sql','cloud'] WHERE id = 288;
    UPDATE courses SET tags = ARRAY['analytics','python','machine_learning','statistics'] WHERE id = 289;
    UPDATE courses SET tags = ARRAY['llm','python','generative_ai'] WHERE id = 290;

    -- MOBILE BEGINNER
    UPDATE courses SET tags = ARRAY['android','kotlin','compose'] WHERE id = 291;
    UPDATE courses SET tags = ARRAY['ios','swift','swiftui'] WHERE id = 292;
    UPDATE courses SET tags = ARRAY['flutter','dart','cross_platform'] WHERE id = 293;
    UPDATE courses SET tags = ARRAY['react_native','javascript','cross_platform'] WHERE id = 294;
    UPDATE courses SET tags = ARRAY['flutter','dart'] WHERE id = 295;

    -- MOBILE INTERMEDIATE
    UPDATE courses SET tags = ARRAY['android','kotlin','jetpack'] WHERE id = 296;
    UPDATE courses SET tags = ARRAY['ios','swift','uikit'] WHERE id = 297;
    UPDATE courses SET tags = ARRAY['react_native','javascript','navigation'] WHERE id = 298;
    UPDATE courses SET tags = ARRAY['android','kotlin','architecture'] WHERE id = 299;
    UPDATE courses SET tags = ARRAY['ios','swift','swiftui','animation'] WHERE id = 300;
    UPDATE courses SET tags = ARRAY['android','kotlin','compose'] WHERE id = 301;
    UPDATE courses SET tags = ARRAY['ios','swift','networking'] WHERE id = 302;

    -- MOBILE ADVANCED
    UPDATE courses SET tags = ARRAY['android','kotlin','architecture','testing'] WHERE id = 303;
    UPDATE courses SET tags = ARRAY['flutter','dart','architecture','state_management'] WHERE id = 304;
    UPDATE courses SET tags = ARRAY['react_native','cross_platform','performance'] WHERE id = 305;
    UPDATE courses SET tags = ARRAY['flutter','firebase','backend_integration'] WHERE id = 306;

    -- MOBILE PROFESSIONAL
    UPDATE courses SET tags = ARRAY['android','performance','compose','optimization'] WHERE id = 307;
    UPDATE courses SET tags = ARRAY['kotlin','java','interop'] WHERE id = 308;
    UPDATE courses SET tags = ARRAY['ios','accessibility','swift'] WHERE id = 309;
    UPDATE courses SET tags = ARRAY['android','certification','jetpack'] WHERE id = 310;
    """)


def downgrade() -> None:
    op.drop_column("courses", "tags")
