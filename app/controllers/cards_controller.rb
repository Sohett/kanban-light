class CardsController < ApplicationController
  before_action :set_card, only: [:show, :edit, :move, :add_label, :remove_label, :update, :destroy]

  # GET /cards
  # GET /cards.json
  def index
    @cards = current_user.cards.all
  end

  # GET /cards/1
  # GET /cards/1.json
  def show
  end

  # GET /cards/new
  def new
    @card = Card.new
  end

  # GET /cards/1/edit
  def edit
  end

  # POST /cards
  # POST /cards.json
  def create
    @card = Card.new(card_params)

    respond_to do |format|
      if @card.save
        format.html { redirect_to @card, notice: 'Card was successfully created.' }
        format.json { render :show, status: :created, location: @card }
      else
        format.html { render :new }
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  def move
    @card.update(card_params)
    render action: :show
  end

  def add_label
    @label = Label.find(label_id)
    @card.labels << @label
    if @card.save
      render action: :show
    else
      format.json { render json: @card.errors, status: :unprocessable_entity }
    end
  end

  def remove_label
    @card.labels_cards.find_by(label_id: label_id).destroy
    @card.reload
    if @card.save
      render action: :show
    else
      format.json { render json: @card.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /cards/1
  # PATCH/PUT /cards/1.json
  def update
    respond_to do |format|
      if @card.update(card_params)
        format.html { redirect_to @card, notice: 'Card was successfully updated.' }
        format.json { render :show, status: :ok, location: @card }
      else
        format.html { render :edit }
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cards/1
  # DELETE /cards/1.json
  def destroy
    @card.destroy
    respond_to do |format|
      format.html { redirect_to cards_url, notice: 'Card was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_card
      @card = Card.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def card_params
      params.require(:card).permit(:list_id, :name, :position, :description)
    end

    def label_id
      params.require(:card).require(:label_id).to_i
    end
end
